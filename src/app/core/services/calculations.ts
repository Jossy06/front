import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface CreateCalculationService {
  service_id: string;
  group_name?: string;
}

export interface CreateCalculation {
  category_name?: string;
  category_icon?: string;
  services: CreateCalculationService[];
}

export interface CalculationItem {
  service_id: string;
  name: string;
  group_name?: string;
  price: number;
  material_cost: number;
}

export interface Calculation {
  id: string;
  category_name?: string | null;
  category_icon?: string | null;
  items: CalculationItem[];
  total: number;
  material_cost: number;
  profit: number;
  margin: number;
  status: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class Calculations {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/calculations`;

  create(
    data: CreateCalculation,
  ): Observable<Calculation> {
    return this.http.post<Calculation>(
      this.apiUrl,
      data,
    );
  }

  findAll(): Observable<Calculation[]> {
    return this.http.get<Calculation[]>(
      this.apiUrl,
    );
  }

  findOne(id: string): Observable<Calculation> {
    return this.http.get<Calculation>(
      `${this.apiUrl}/${id}`,
    );
  }

  remove(
    id: string,
  ): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}