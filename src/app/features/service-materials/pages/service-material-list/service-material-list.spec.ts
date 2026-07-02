import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMaterialList } from './service-material-list';

describe('ServiceMaterialList', () => {
  let component: ServiceMaterialList;
  let fixture: ComponentFixture<ServiceMaterialList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceMaterialList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMaterialList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
