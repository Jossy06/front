import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceGroupList } from './service-group-list';

describe('ServiceGroupList', () => {
  let component: ServiceGroupList;
  let fixture: ComponentFixture<ServiceGroupList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceGroupList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceGroupList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
