import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialFormDialog } from './material-form-dialog';

describe('MaterialFormDialog', () => {
  let component: MaterialFormDialog;
  let fixture: ComponentFixture<MaterialFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
