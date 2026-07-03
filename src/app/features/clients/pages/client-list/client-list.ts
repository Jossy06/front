import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import Swal from 'sweetalert2';

import {
  Client,
  Clients,
  CreateClient,
} from '../../../../core/services/clients';

import { ClientFormDialog } from '../../components/client-form-dialog/client-form-dialog';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-client-list',
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
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  private readonly clientsService = inject(Clients);
  private readonly dialog = inject(MatDialog);

  displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'address',
    'actions',
  ];

  clients: Client[] = [];
  filteredClients: Client[] = [];

  loading = true;
  search = '';

  currentPage = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadClients();
  }

  get totalItems(): number {
    return this.filteredClients.length;
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

  get paginatedClients(): Client[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return this.filteredClients.slice(start, end);
  }

  loadClients(): void {
    this.loading = true;

    this.clientsService.findAll().subscribe({
      next: (response: Client[]) => {
        this.clients = response;
        this.filteredClients = response;
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire(
          'Error',
          'No se pudieron cargar los clientes',
          'error',
        );
      },
    });
  }

  filterClients(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredClients = this.clients.filter((client) =>
      client.name.toLowerCase().includes(value) ||
      client.phone.toLowerCase().includes(value) ||
      (client.email ?? '').toLowerCase().includes(value) ||
      (client.address ?? '').toLowerCase().includes(value),
    );

    this.currentPage = 1;
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

  openCreateForm(): void {
    const dialogRef = this.dialog.open(ClientFormDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: null,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateClient | undefined) => {
        if (!result) return;

        this.clientsService.create(result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cliente creado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.search = '';
            this.loadClients();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo crear el cliente',
              'error',
            );
          },
        });
      },
    );
  }

  openEditForm(client: Client): void {
    const dialogRef = this.dialog.open(ClientFormDialog, {
      width: '520px',
      maxWidth: '95vw',
      data: client,
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe(
      (result: CreateClient | undefined) => {
        if (!result) return;

        this.clientsService.update(client.id, result).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Cliente actualizado',
              timer: 1200,
              showConfirmButton: false,
            });

            this.loadClients();
          },
          error: () => {
            Swal.fire(
              'Error',
              'No se pudo actualizar el cliente',
              'error',
            );
          },
        });
      },
    );
  }

  deleteClient(client: Client): void {
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: `Se eliminará a ${client.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d63384',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.clientsService.remove(client.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Cliente eliminado',
            timer: 1200,
            showConfirmButton: false,
          });

          this.loadClients();
        },
        error: () => {
          Swal.fire(
            'Error',
            'No se pudo eliminar el cliente',
            'error',
          );
        },
      });
    });
  }
}