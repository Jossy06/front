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
  CreateServiceMaterial,
  ServiceMaterial,
} from '../../../../core/services/service-materials';

import {
  Service,
  Services,
} from '../../../../core/services/services';

import {
  Material,
  Materials,
} from '../../../../core/services/materials';

@Component({
  selector: 'app-service-material-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './service-material-form-dialog.html',
  styleUrl: './service-material-form-dialog.scss',
})
export class ServiceMaterialFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly servicesService = inject(Services);
  private readonly materialsService = inject(Materials);

  readonly dialogRef =
    inject(MatDialogRef<ServiceMaterialFormDialog>);

  readonly data =
    inject<ServiceMaterial | null>(MAT_DIALOG_DATA);

  services: Service[] = [];
  materials: Material[] = [];

  form = this.fb.group({
    service_id: [
      this.data?.service_id ?? '',
      Validators.required,
    ],
    material_id: [
      this.data?.material_id ?? '',
      Validators.required,
    ],
    quantity: [
      this.data?.quantity ?? 0,
      [
        Validators.required,
        Validators.min(0.01),
      ],
    ],
  });

  constructor() {
    this.loadServices();
    this.loadMaterials();
  }

  loadServices(): void {
    this.servicesService.findAll().subscribe({
      next: (response) => {
        this.services = response;
      },
    });
  }

  loadMaterials(): void {
    this.materialsService.findAll().subscribe({
      next: (response) => {
        this.materials = response;
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: CreateServiceMaterial = {
      service_id: this.form.value.service_id!,
      material_id: this.form.value.material_id!,
      quantity: Number(this.form.value.quantity),
    };

    this.dialogRef.close(data);
  }

  close(): void {
    this.dialogRef.close();
  }
}