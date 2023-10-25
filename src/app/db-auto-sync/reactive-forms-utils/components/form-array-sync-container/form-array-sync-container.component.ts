import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import { CollectionSync } from '@db-auto-sync/core/collection-sync';
import { DocumentSync } from '@db-auto-sync/core/document-sync';
import { FormGroupSyncDirective } from '@db-auto-sync/reactive-forms-utils/directives/form-group-sync/form-group-sync.directive';
import { FormArrayLocalController } from '@db-auto-sync/reactive-forms-utils/form-array-local-controller';
import {
  ReplaySubject,
  Subject,
  combineLatest,
  defaultIfEmpty,
  exhaustMap,
  first,
  forkJoin,
  map,
  merge,
  share,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-form-array-sync-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-array-sync-container.component.html',
  styleUrls: ['./form-array-sync-container.component.scss'],
  exportAs: 'appFormArraySyncContainer',
})
export class FormArraySyncContainerComponent<
  TControl extends { [K in keyof TControl]: AbstractControl<TControl[K], any> },
  TFormArrayItem extends FormGroup<TControl>
> implements AfterContentInit
{
  private readonly controlContainer = inject(ControlContainer);

  @Input({ required: true })
  set serverController(value: ServerController<TFormArrayItem>) {
    this.serverController$.next(value);
  }

  @ContentChildren(FormGroupSyncDirective)
  formGroupSyncs!: QueryList<FormGroupSyncDirective<TControl>>;

  private readonly set$ = new Subject<DocumentSync<TFormArrayItem>>();
  private readonly delete$ = new Subject<DocumentSync<TFormArrayItem>>();
  private readonly swap$ = new Subject<[number, number]>();
  private readonly serverController$ = new Subject<
    ServerController<TFormArrayItem>
  >();
  private readonly formArray$ = new ReplaySubject<FormArray<TFormArrayItem>>(1);
  private readonly formGroupSyncsDirectives$ = new Subject<
    QueryList<FormGroupSyncDirective<TControl>>
  >();

  private readonly formGroupSyncs$ = this.formGroupSyncsDirectives$.pipe(
    switchMap((directives) =>
      forkJoin(
        directives.map((directive) => directive.docSync$.pipe(first()))
      ).pipe(defaultIfEmpty([] as DocumentSync<TFormArrayItem>[]))
    )
  );

  private readonly formArraySyncDeps$ = combineLatest({
    formArray: this.formArray$,
    formGroupSyncs: this.formGroupSyncs$,
    serverController: this.serverController$,
  });

  private readonly formArraySync$ = this.formArraySyncDeps$.pipe(
    map(
      (deps) =>
        new CollectionSync(
          deps.serverController,
          new FormArrayLocalController(deps.formArray),
          deps.formGroupSyncs
        )
    ),
    share()
  );

  private readonly actionsDispatchers$ = this.formArraySync$.pipe(
    switchMap((formArraySync) =>
      merge(
        this.delete$.pipe(tap((docSync) => formArraySync.delete(docSync.id))),
        this.swap$.pipe(
          tap(([index1, index2]) => formArraySync.swap(index1, index2))
        ),
        this.set$.pipe(tap((docSync) => formArraySync.set(docSync)))
      )
    )
  );

  private readonly sync$ = this.formArraySync$.pipe(
    exhaustMap((formArraySync) => formArraySync.init())
  );

  constructor() {
    merge(this.actionsDispatchers$, this.sync$)
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  ngOnInit(): void {
    const formArray = this.controlContainer
      .control as FormArray<TFormArrayItem>;

    if (formArray instanceof FormArray !== true) {
      throw new Error('appFormArraySync directive must be used on a FormArray');
    }

    this.formArray$.next(formArray);
  }

  ngAfterContentInit(): void {
    this.formGroupSyncsDirectives$.next(this.formGroupSyncs);
  }

  set(docSync: DocumentSync<TFormArrayItem>) {
    this.set$.next(docSync);
  }

  remove(docSync: DocumentSync<TFormArrayItem>) {
    this.delete$.next(docSync);
  }

  swap(index1: number, index2: number) {
    this.swap$.next([index1, index2]);
  }
}
