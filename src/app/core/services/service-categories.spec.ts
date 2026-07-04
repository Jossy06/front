import { TestBed } from '@angular/core/testing';

import { ServiceCategories } from './service-categories';

describe('ServiceCategories', () => {
  let service: ServiceCategories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCategories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
