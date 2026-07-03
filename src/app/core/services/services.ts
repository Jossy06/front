import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Service {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  created_at?: string;
}

export interface CreateService {
  name: string;
  description?: string;
  base_price: number;
}

@Injectable({
  providedIn: 'root',
})
export class Services {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/services`;

  findAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  create(data: CreateService): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, data);
  }

  update(id: string, data: CreateService): Observable<Service> {
    return this.http.patch<Service>(`${this.apiUrl}/${id}`, data);
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}