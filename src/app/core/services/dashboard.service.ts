import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export interface DashboardData {
  totalClients: number;
  totalServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  appointmentsToday: number;
  totalInvoices: number;
  totalSales: number;
  salesToday: number;
  salesMonth: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboard() {
    return this.http.get<DashboardData>(
      `${environment.apiUrl}/dashboard`,
    );
  }
}