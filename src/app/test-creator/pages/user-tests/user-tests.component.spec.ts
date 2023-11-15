import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestsComponent } from './user-tests.component';

describe('UserTestsComponent', () => {
  let component: UserTestsComponent;
  let fixture: ComponentFixture<UserTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
