import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';

import {
  Service,
  Services,
  CreateService,
} from '../../../../core/services/services';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ServiceFormDialog } from '../../components/service-form-dialog/service-form-dialog';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
    PageHeader,
    EmptyState,
  ],
  templateUrl: './service-list.html',
  styleUrl: './service-list.scss',
})
export class ServiceList implements OnInit {
  private readonly servicesService = inject(Services);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'description',
    'base_price',
    'actions',
  ];

  services: Service[] = [];
  filteredServices: Service[] = [];

  loading = true;
  search = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadServices();
  }

  get totalItems(): number {
    return this.filteredServices.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1,
    );
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.totalItems,
    );
  }

  get paginatedServices(): Service[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredServices.slice(start, start + this.pageSize);
  }

  loadServices(): void {
    this.loading = true;

    this.servicesService.findAll().subscribe({
      next: (response: Service[]) => {
        this.services = response;
        this.filteredServices = response;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire(
          'Error',
          'No se pudieron cargar los servicios',
          'error',
        );
      },
    });
  }

  filterServices(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredServices = this.services.filter((service) =>
      service.name.toLowerCase().includes(value) ||
      (service.description ?? '').toLowerCase().includes(value) ||
      String(service.base_price).includes(value),
    );

    this.currentPage = 1;
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(ServiceFormDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: null,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateService | undefined) => {
        if (!result) return;

        this.servicesService.create(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Servicio creado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.search = '';
            this.loadServices();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo crear el servicio',
              'error',
            );
          },
        });
      },
    );
  }

  openEditForm(service: Service): void {
    const dialogRef = this.dialog.open(ServiceFormDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: service,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateService | undefined) => {
        if (!result) return;

        this.servicesService.update(service.id, result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Servicio actualizado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.loadServices();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo actualizar el servicio',
              'error',
            );
          },
        });
      },
    );
  }

  deleteService(service: Service): void {
    Swal.fire({
      title: '¿Eliminar servicio?',
      text: `Se eliminará ${service.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d63384',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.servicesService.remove(service.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Servicio eliminado',
            timer: 1200,
            showConfirmButton: false,
          });

          this.loadServices();
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudo eliminar el servicio',
            'error',
          );
        },
      });
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
}