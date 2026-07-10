import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMaterialFormDialog } from './service-material-form-dialog';

describe('ServiceMaterialFormDialog', () => {
  let component: ServiceMaterialFormDialog;
  let fixture: ComponentFixture<ServiceMaterialFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceMaterialFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceMaterialFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
