import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorPage } from './calculator-page';

describe('CalculatorPage', () => {
  let component: CalculatorPage;
  let fixture: ComponentFixture<CalculatorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
