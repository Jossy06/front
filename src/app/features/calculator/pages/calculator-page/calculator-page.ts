import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

import Swal from 'sweetalert2';

import {
  ServiceCategory,
  ServiceCategories,
} from '../../../../core/services/service-categories';

import {
  ServiceGroup,
  ServiceGroups,
} from '../../../../core/services/service-groups';

import {
  Service,
  Services,
} from '../../../../core/services/services';

import {
  ServiceMaterial,
  ServiceMaterials,
} from '../../../../core/services/service-materials';

import {
  Calculations,
  CreateCalculation,
} from '../../../../core/services/calculations';

import { CalculationSummaryDialog } from '../../components/calculation-summary-dialog/calculation-summary-dialog';

interface CalculatorItem {
  id: string;
  name: string;
  price: number;
  groupId: string;
  groupName: string;
}

interface CalculatorGroup {
  id: string;
  name: string;
  icon?: string;
  multiple: boolean;
  required: boolean;
  adds_price: boolean;
  sort: number;
  services: CalculatorItem[];
}

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
  ],
  templateUrl: './calculator-page.html',
  styleUrl: './calculator-page.scss',
})
export class CalculatorPage implements OnInit {
  private readonly categoriesService =
    inject(ServiceCategories);

  private readonly groupsService =
    inject(ServiceGroups);

  private readonly servicesService =
    inject(Services);

  private readonly serviceMaterialsService =
    inject(ServiceMaterials);

  private readonly calculationsService =
    inject(Calculations);

  private readonly dialog =
    inject(MatDialog);

  categories: ServiceCategory[] = [];
  serviceGroups: ServiceGroup[] = [];
  services: Service[] = [];
  serviceMaterials: ServiceMaterial[] = [];

  activeCategory: ServiceCategory | null = null;

  groups: CalculatorGroup[] = [];
  selectedItems: CalculatorItem[] = [];

  loading = true;
  saving = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.categoriesService.findAll().subscribe({
      next: (categories) => {
        this.categories = categories.filter(
          (category) =>
            category.is_active !== false,
        );

        this.activeCategory =
          this.categories[0] ?? null;

        this.groupsService.findAll().subscribe({
          next: (groups) => {
            this.serviceGroups = groups.filter(
              (group) =>
                group.is_active !== false,
            );

            this.servicesService.findAll().subscribe({
              next: (services) => {
                this.services = services;

                this.serviceMaterialsService
                  .findAll()
                  .subscribe({
                    next: (materials) => {
                      this.serviceMaterials =
                        materials;

                      this.buildGroups();
                      this.loading = false;
                    },
                    error: () => {
                      this.loading = false;

                      Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar los materiales por servicio.',
                      });
                    },
                  });
              },
              error: () => {
                this.loading = false;

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudieron cargar los servicios.',
                });
              },
            });
          },
          error: () => {
            this.loading = false;

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar los grupos de servicios.',
            });
          },
        });
      },
      error: () => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías.',
        });
      },
    });
  }

  selectCategory(
    category: ServiceCategory,
  ): void {
    this.activeCategory = category;
    this.selectedItems = [];
    this.buildGroups();
  }

  buildGroups(): void {
    if (!this.activeCategory) {
      this.groups = [];
      return;
    }

    const groupsByCategory =
      this.serviceGroups
        .filter(
          (group) =>
            group.category_id ===
            this.activeCategory?.id,
        )
        .sort(
          (a, b) =>
            Number(a.sort) -
            Number(b.sort),
        );

    this.groups = groupsByCategory.map(
      (group) => {
        const services = this.services
          .filter(
            (service) =>
              service.group_id === group.id,
          )
          .map((service) => ({
            id: service.id,
            name: service.name,
            price: Number(
              service.base_price,
            ),
            groupId: group.id,
            groupName: group.name,
          }));

        return {
          id: group.id,
          name: group.name,
          icon: group.icon ?? '',
          multiple:
            group.multiple ?? true,
          required:
            group.required ?? false,
          adds_price:
            group.adds_price ?? true,
          sort: Number(group.sort),
          services,
        };
      },
    );
  }

  toggleItem(
    item: CalculatorItem,
    group: CalculatorGroup,
  ): void {
    const exists = this.isSelected(item);

    if (exists) {
      this.selectedItems =
        this.selectedItems.filter(
          (selected) =>
            selected.id !== item.id,
        );

      return;
    }

    if (!group.multiple) {
      this.selectedItems =
        this.selectedItems.filter(
          (selected) =>
            selected.groupId !== group.id,
        );
    }

    this.selectedItems = [
      ...this.selectedItems,
      item,
    ];
  }

  isSelected(
    item: CalculatorItem,
  ): boolean {
    return this.selectedItems.some(
      (selected) =>
        selected.id === item.id,
    );
  }

  getMaterialCostByService(
    serviceId: string,
  ): number {
    return this.serviceMaterials
      .filter(
        (item) =>
          item.service_id === serviceId,
      )
      .reduce((sum, item) => {
        const quantity = Number(
          item.quantity,
        );

        const unitPrice = Number(
          item.material?.unit_price ?? 0,
        );

        return (
          sum +
          quantity * unitPrice
        );
      }, 0);
  }

  openSummary(): void {
    if (
      this.selectedItems.length === 0 ||
      !this.activeCategory ||
      this.saving
    ) {
      return;
    }

    const dialogRef = this.dialog.open(
      CalculationSummaryDialog,
      {
        width: '560px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          categoryName:
            this.activeCategory.name,

          categoryIcon:
            this.activeCategory.icon ??
            '✨',

          items: this.selectedItems,

          total: this.total,

          color: this.activeColor,
        },
      },
    );

    dialogRef.afterClosed().subscribe(
      (
        confirmed:
          | boolean
          | undefined,
      ) => {
        if (!confirmed) {
          return;
        }

        this.saveCalculation();
      },
    );
  }

  saveCalculation(): void {
    if (
      this.saving ||
      !this.activeCategory ||
      this.selectedItems.length === 0
    ) {
      return;
    }

    const data: CreateCalculation = {
      category_name:
        this.activeCategory.name,

      category_icon:
        this.activeCategory.icon ??
        '✨',

      services: this.selectedItems.map(
        (item) => ({
          service_id: item.id,
          group_name: item.groupName,
        }),
      ),
    };

    this.saving = true;

    this.calculationsService
      .create(data)
      .subscribe({
        next: (calculation) => {
          this.saving = false;

          Swal.fire({
            icon: 'success',
            title: 'Servicio confirmado',
            html: `
              <p>El servicio fue guardado correctamente.</p>
              <strong>
                Total: $${Number(
                  calculation.total,
                ).toFixed(2)}
              </strong>
            `,
            confirmButtonColor:
              this.activeColor,
          });

          this.clearCalculation();
        },

        error: (error: unknown) => {
          this.saving = false;

          console.error(
            'Error al guardar el cálculo:',
            error,
          );

          Swal.fire({
            icon: 'error',
            title: 'No se pudo guardar',
            text: 'Verifica la conexión con el servidor e inténtalo nuevamente.',
            confirmButtonColor:
              '#d63384',
          });
        },
      });
  }

  clearCalculation(): void {
    this.selectedItems = [];
  }

  get total(): number {
    return this.selectedItems.reduce(
      (sum, item) =>
        sum + item.price,
      0,
    );
  }

  get materialCost(): number {
    return this.selectedItems.reduce(
      (sum, item) =>
        sum +
        this.getMaterialCostByService(
          item.id,
        ),
      0,
    );
  }

  get profit(): number {
    return (
      this.total -
      this.materialCost
    );
  }

  get margin(): number {
    if (this.total === 0) {
      return 0;
    }

    return (
      (this.profit / this.total) *
      100
    );
  }

  get activeColor(): string {
    return (
      this.activeCategory?.color ??
      '#ec2f86'
    );
  }
}