import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';

import {
  Material,
  Materials,
  CreateMaterial,
} from '../../../../core/services/materials';

import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MaterialFormDialog } from '../../components/material-form-dialog/material-form-dialog';

@Component({
  selector: 'app-material-list',
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
  templateUrl: './material-list.html',
  styleUrl: './material-list.scss',
})
export class MaterialList implements OnInit {
  private readonly materialsService = inject(Materials);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'unit_price',
    'stock',
    'unit',
    'actions',
  ];

  materials: Material[] = [];
  filteredMaterials: Material[] = [];

  loading = true;
  search = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMaterials();
  }

  get totalItems(): number {
    return this.filteredMaterials.length;
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

  get paginatedMaterials(): Material[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMaterials.slice(start, start + this.pageSize);
  }

  loadMaterials(): void {
    this.loading = true;

    this.materialsService.findAll().subscribe({
      next: (response: Material[]) => {
        this.materials = response;
        this.filteredMaterials = response;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;

        Swal.fire(
          'Error',
          'No se pudieron cargar los materiales',
          'error',
        );
      },
    });
  }

  filterMaterials(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredMaterials = this.materials.filter((material) =>
      material.name.toLowerCase().includes(value) ||
      material.unit.toLowerCase().includes(value) ||
      String(material.unit_price).includes(value) ||
      String(material.stock).includes(value),
    );

    this.currentPage = 1;
  }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(MaterialFormDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: null,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateMaterial | undefined) => {
        if (!result) return;

        this.materialsService.create(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Material creado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.search = '';
            this.loadMaterials();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo crear el material',
              'error',
            );
          },
        });
      },
    );
  }

  openEditForm(material: Material): void {
    const dialogRef = this.dialog.open(MaterialFormDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: material,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateMaterial | undefined) => {
        if (!result) return;

        this.materialsService.update(material.id, result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Material actualizado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.loadMaterials();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo actualizar el material',
              'error',
            );
          },
        });
      },
    );
  }

  deleteMaterial(material: Material): void {
    Swal.fire({
      title: '¿Eliminar material?',
      text: `Se eliminará ${material.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d63384',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.materialsService.remove(material.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Material eliminado',
            timer: 1200,
            showConfirmButton: false,
          });

          this.loadMaterials();
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudo eliminar el material',
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