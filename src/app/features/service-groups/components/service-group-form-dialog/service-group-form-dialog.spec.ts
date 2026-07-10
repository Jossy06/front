import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupFormDialog } from './service-group-form-dialog';

describe('ServiceGroupFormDialog', () => {
  let component: ServiceGroupFormDialog;
  let fixture: ComponentFixture<ServiceGroupFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceGroupFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceGroupFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
