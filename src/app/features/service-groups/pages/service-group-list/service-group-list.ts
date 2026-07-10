import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';

import {
  ServiceGroup,
  ServiceGroups,
  CreateServiceGroup,
} from '../../../../core/services/service-groups';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ServiceGroupFormDialog } from '../../components/service-group-form-dialog/service-group-form-dialog';

@Component({
  selector: 'app-service-group-list',
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
  templateUrl: './service-group-list.html',
  styleUrl: './service-group-list.scss',
})
export class ServiceGroupList implements OnInit {
  private readonly serviceGroupsService = inject(ServiceGroups);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'category',
    'sort',
    'multiple',
    'required',
    'adds_price',
    'is_active',
    'actions',
  ];

  groups: ServiceGroup[] = [];
  filteredGroups: ServiceGroup[] = [];

  loading = true;
  search = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadGroups();
  }

  get totalItems(): number {
    return this.filteredGroups.length;
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

  get paginatedGroups(): ServiceGroup[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredGroups.slice(
      start,
      start + this.pageSize,
    );
  }

  loadGroups(): void {
    this.loading = true;

    this.serviceGroupsService.findAll().subscribe({
      next: (response: ServiceGroup[]) => {
        this.groups = response;
        this.filteredGroups = response;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;

        Swal.fire(
          'Error',
          'No se pudieron cargar los grupos',
          'error',
        );
      },
    });
  }

  filterGroups(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredGroups = this.groups.filter((group) =>
      group.name.toLowerCase().includes(value) ||
      (group.category?.name ?? '').toLowerCase().includes(value),
    );

    this.currentPage = 1;
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(ServiceGroupFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      data: null,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateServiceGroup | undefined) => {
        if (!result) return;

        this.serviceGroupsService.create(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Grupo creado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.search = '';
            this.loadGroups();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo crear el grupo',
              'error',
            );
          },
        });
      },
    );
  }

  openEditForm(group: ServiceGroup): void {
    const dialogRef = this.dialog.open(ServiceGroupFormDialog, {
      width: '560px',
      maxWidth: '95vw',
      data: group,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateServiceGroup | undefined) => {
        if (!result) return;

        this.serviceGroupsService.update(group.id, result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Grupo actualizado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.loadGroups();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo actualizar el grupo',
              'error',
            );
          },
        });
      },
    );
  }

  deleteGroup(group: ServiceGroup): void {
    Swal.fire({
      title: '¿Eliminar grupo?',
      text: `Se eliminará ${group.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d63384',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.serviceGroupsService.remove(group.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Grupo eliminado',
            timer: 1200,
            showConfirmButton: false,
          });

          this.loadGroups();
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudo eliminar el grupo',
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