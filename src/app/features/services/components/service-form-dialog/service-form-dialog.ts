import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  CreateService,
  Service,
} from '../../../../core/services/services';

@Component({
  selector: 'app-service-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './service-form-dialog.html',
  styleUrl: './service-form-dialog.scss',
})
export class ServiceFormDialog {
  private readonly fb = inject(FormBuilder);

  readonly dialogRef =
    inject(MatDialogRef<ServiceFormDialog>);

  readonly data =
    inject<Service | null>(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [
      this.data?.name ?? '',
      Validators.required,
    ],

    description: [
      this.data?.description ?? '',
    ],

    base_price: [
      this.data?.base_price ?? 0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(
      this.form.value as CreateService,
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}