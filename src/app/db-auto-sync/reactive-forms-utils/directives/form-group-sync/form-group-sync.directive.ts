import { Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { ServerController } from '@db-auto-sync/abstract/server-controller';
import { DocumentSync } from '@db-auto-sync/core/document-sync';
import { FormGroupChangeSource } from '@db-auto-sync/reactive-forms-utils/form-group-change-source';
import {
  BehaviorSubject,
  ReplaySubject,
  Subject,
  combineLatest,
  map,
  shareReplay,
  switchMap,
} from 'rxjs';

@Directive({
  selector: '[appFormGroupSync]',
  standalone: true,
})
export class FormGroupSyncDirective<
  TControl extends { [K in keyof TControl]: AbstractControl<TControl[K]> }
> implements OnInit
{
  private readonly controlContainer = inject(ControlContainer);

  private readonly _formGroup$ = new ReplaySubject<FormGroup<TControl>>(1);
  private readonly serverController$ = new Subject<
    ServerController<FormGroup<TControl>>
  >();
  private readonly _docId$ = new ReplaySubject<string>(1);
  private readonly _excludeFields$ = new BehaviorSubject<(keyof TControl)[]>(
    []
  );

  public readonly docSync$ = combineLatest({
    formGroup: this._formGroup$,
    serverController: this.serverController$,
    docId: this._docId$,
    excludedFields: this._excludeFields$,
  }).pipe(
    map(
      ({ formGroup, serverController, docId, excludedFields }) =>
        new DocumentSync(
          new FormGroupChangeSource(
            formGroup,
            excludedFields as any // TODO: Improve this type
          ),
          serverController,
          docId
        )
    ),
    shareReplay(1)
  );

  private readonly sync$ = this.docSync$.pipe(
    switchMap((docSync) => docSync.init())
  );

  @Input({ required: true, alias: 'appFormGroupSync' })
  set serverController(controller: ServerController<FormGroup<TControl>>) {
    this.serverController$.next(controller);
  }

  @Input({ required: true }) set docId(id: string) {
    this._docId$.next(id);
  }

  @Input() set excludeFields(fields: (keyof TControl)[]) {
    this._excludeFields$.next(fields);
  }

  constructor() {
    this.sync$.pipe(takeUntilDestroyed()).subscribe();
  }

  ngOnInit(): void {
    if (this.controlContainer.control instanceof FormGroup === false) {
      throw new Error(
        'appFormGroupSync directive can be used only on FormGroup'
      );
    }

    this._formGroup$.next(this.controlContainer.control as FormGroup);
  }

  get formGroup$() {
    return this._formGroup$.asObservable();
  }

  get docId$() {
    return this._docId$.asObservable();
  }

  get excludeFields$() {
    return this._excludeFields$.asObservable();
  }
}
