import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersKeysPageComponent } from './answers-keys-page.component';

describe('AnswersKeysPageComponent', () => {
  let component: AnswersKeysPageComponent;
  let fixture: ComponentFixture<AnswersKeysPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswersKeysPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswersKeysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
