import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
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

import { Client } from '../../../../core/services/clients';

@Component({
  selector: 'app-client-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './client-form-dialog.html',
  styleUrl: './client-form-dialog.scss',
})
export class ClientFormDialog {
  private readonly fb = inject(FormBuilder);

  clientForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    email: [''],
    address: [''],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<ClientFormDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: Client | null,
  ) {
    if (data) {
      this.clientForm.patchValue({
        name: data.name,
        phone: data.phone,
        email: data.email ?? '',
        address: data.address ?? '',
      });
    }
  }

  save() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.clientForm.value);
  }

  close() {
    this.dialogRef.close();
  }
}