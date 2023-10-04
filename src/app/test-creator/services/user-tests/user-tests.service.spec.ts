import { TestBed } from '@angular/core/testing';

import { UserTestsService } from './user-tests.service';

describe('UserTestsService', () => {
  let service: UserTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
