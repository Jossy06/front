import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryList } from './service-category-list';

describe('ServiceCategoryList', () => {
  let component: ServiceCategoryList;
  let fixture: ComponentFixture<ServiceCategoryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceCategoryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCategoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
