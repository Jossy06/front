import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryFormDialog } from './service-category-form-dialog';

describe('ServiceCategoryFormDialog', () => {
  let component: ServiceCategoryFormDialog;
  let fixture: ComponentFixture<ServiceCategoryFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCategoryFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCategoryFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
