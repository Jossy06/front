import { TestBed } from '@angular/core/testing';

import { ServiceGroups } from './service-groups';

describe('ServiceGroups', () => {
  let service: ServiceGroups;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceGroups);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
