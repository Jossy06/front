import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Material {
  id: string;
  name: string;
  unit_price: number;
  stock: number;
  unit: string;
  created_at?: string;
}

export interface CreateMaterial {
  name: string;
  unit_price: number;
  stock: number;
  unit: string;
}

@Injectable({
  providedIn: 'root',
})
export class Materials {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/materials`;

  findAll(): Observable<Material[]> {
    return this.http.get<Material[]>(this.apiUrl);
  }

  create(data: CreateMaterial): Observable<Material> {
    return this.http.post<Material>(this.apiUrl, data);
  }

  update(id: string, data: CreateMaterial): Observable<Material> {
    return this.http.patch<Material>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}