import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ClientSummaryItem {
  name: string;
  groupName: string;
  price: number;
}

export interface CalculationSummaryData {
  categoryName: string;
  categoryIcon?: string;
  items: ClientSummaryItem[];
  total: number;
  color: string;
}

@Component({
  selector: 'app-calculation-summary-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './calculation-summary-dialog.html',
  styleUrl: './calculation-summary-dialog.scss',
})
export class CalculationSummaryDialog {
  readonly dialogRef =
    inject(MatDialogRef<CalculationSummaryDialog>);

  readonly data =
    inject<CalculationSummaryData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}