import { TestBed } from '@angular/core/testing';

import { ErrorPresenterService } from './error-presenter.service';

describe('ErrorPresenterService', () => {
  let service: ErrorPresenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorPresenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
