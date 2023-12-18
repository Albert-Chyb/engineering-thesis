import { TestBed } from '@angular/core/testing';

import { SharedTestsService } from './shared-tests.service';

describe('SharedTestsService', () => {
  let service: SharedTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
