import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTestsPageComponent } from './shared-tests-page.component';

describe('SharedTestsPageComponent', () => {
  let component: SharedTestsPageComponent;
  let fixture: ComponentFixture<SharedTestsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedTestsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
