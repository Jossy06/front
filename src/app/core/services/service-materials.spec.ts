import { TestBed } from '@angular/core/testing';

import { ServiceMaterials } from './service-materials';

describe('ServiceMaterials', () => {
  let service: ServiceMaterials;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceMaterials);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
