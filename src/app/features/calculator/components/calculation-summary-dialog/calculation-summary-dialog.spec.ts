import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationSummaryDialog } from './calculation-summary-dialog';

describe('CalculationSummaryDialog', () => {
  let component: CalculationSummaryDialog;
  let fixture: ComponentFixture<CalculationSummaryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculationSummaryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculationSummaryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
