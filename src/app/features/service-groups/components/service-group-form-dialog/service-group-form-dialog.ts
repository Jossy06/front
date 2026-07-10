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
  ServiceGroup,
  CreateServiceGroup,
} from '../../../../core/services/service-groups';

import {
  ServiceCategory,
  ServiceCategories,
} from '../../../../core/services/service-categories';

@Component({
  selector: 'app-service-group-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './service-group-form-dialog.html',
  styleUrl: './service-group-form-dialog.scss',
})
export class ServiceGroupFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesService = inject(ServiceCategories);

  readonly dialogRef =
    inject(MatDialogRef<ServiceGroupFormDialog>);

  readonly data =
    inject<ServiceGroup | null>(MAT_DIALOG_DATA);

  categories: ServiceCategory[] = [];

  form = this.fb.group({
    name: [
      this.data?.name ?? '',
      Validators.required,
    ],
    icon: [
      this.data?.icon ?? '',
    ],
    sort: [
      this.data?.sort ?? 1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
    category_id: [
      this.data?.category_id ?? '',
      Validators.required,
    ],
    multiple: [
      this.data?.multiple ?? true,
    ],
    required: [
      this.data?.required ?? false,
    ],
    adds_price: [
      this.data?.adds_price ?? true,
    ],
    is_active: [
      this.data?.is_active ?? true,
    ],
  });

  constructor() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.findAll().subscribe({
      next: (response) => {
        this.categories = response.filter(
          (category) => category.is_active !== false,
        );
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: CreateServiceGroup = {
      name: this.form.value.name!,
      icon: this.form.value.icon ?? '',
      sort: Number(this.form.value.sort),
      category_id: this.form.value.category_id!,
      multiple: Boolean(this.form.value.multiple),
      required: Boolean(this.form.value.required),
      adds_price: Boolean(this.form.value.adds_price),
      is_active: Boolean(this.form.value.is_active),
    };

    this.dialogRef.close(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}