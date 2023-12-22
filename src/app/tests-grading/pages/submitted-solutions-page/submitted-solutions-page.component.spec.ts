import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedSolutionsPageComponent } from './submitted-solutions-page.component';

describe('SubmittedSolutionsPageComponent', () => {
  let component: SubmittedSolutionsPageComponent;
  let fixture: ComponentFixture<SubmittedSolutionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmittedSolutionsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmittedSolutionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
