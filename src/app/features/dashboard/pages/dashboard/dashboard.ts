import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
} from 'ng-apexcharts';

import {
  DashboardService,
  DashboardData,
} from '../../../../core/services/dashboard.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private readonly dashboardService =
    inject(DashboardService);

  // Fecha actual para mostrar en la vista
  today = new Date();

  loading = true;

  dashboard: DashboardData = {
    totalClients: 0,
    totalServices: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    appointmentsToday: 0,
    totalInvoices: 0,
    totalSales: 0,
    salesToday: 0,
    salesMonth: 0,
  };

  chartOptions: ChartOptions = {
    series: [
      {
        name: 'Ventas',
        data: [0, 0, 0, 0],
      },
    ],
    chart: {
      type: 'area',
      height: 320,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        'Semana 1',
        'Semana 2',
        'Semana 3',
        'Semana 4',
      ],
    },
    stroke: {
      curve: 'smooth',
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${value}`,
      },
    },
  };

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getDashboard().subscribe({
      next: (response: DashboardData) => {
        this.dashboard = response;

        this.chartOptions = {
          ...this.chartOptions,
          series: [
            {
              name: 'Ventas',
              data: [
                response.salesToday,
                response.salesMonth,
                response.totalSales,
                response.totalSales,
              ],
            },
          ],
        };

        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error cargando dashboard:', error);
        this.loading = false;
      },
    });
  }
}