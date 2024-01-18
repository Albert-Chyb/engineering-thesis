import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnhandledErrorComponent } from './unhandled-error.component';

describe('UnhandledErrorComponent', () => {
  let component: UnhandledErrorComponent;
  let fixture: ComponentFixture<UnhandledErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UnhandledErrorComponent]
    });
    fixture = TestBed.createComponent(UnhandledErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
