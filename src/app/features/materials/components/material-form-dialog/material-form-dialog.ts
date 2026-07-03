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
  CreateMaterial,
  Material,
} from '../../../../core/services/materials';

@Component({
  selector: 'app-material-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './material-form-dialog.html',
  styleUrl: './material-form-dialog.scss',
})
export class MaterialFormDialog {
  private readonly fb = inject(FormBuilder);

  readonly dialogRef =
    inject(MatDialogRef<MaterialFormDialog>);

  readonly data =
    inject<Material | null>(MAT_DIALOG_DATA);

  form = this.fb.group({
    name: [
      this.data?.name ?? '',
      Validators.required,
    ],
    unit_price: [
      this.data?.unit_price ?? 0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],
    stock: [
      this.data?.stock ?? 0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],
    unit: [
      this.data?.unit ?? '',
      Validators.required,
    ],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: CreateMaterial = {
      name: this.form.value.name!,
      unit_price: Number(this.form.value.unit_price),
      stock: Number(this.form.value.stock),
      unit: this.form.value.unit!,
    };

    this.dialogRef.close(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}