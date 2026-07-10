import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ServiceGroup {
  id: string;
  name: string;
  icon?: string;
  sort: number;
  is_active: boolean;
  category_id: string;
  multiple?: boolean;
  required?: boolean;
  adds_price?: boolean;

  category?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
}

export interface CreateServiceGroup {
  name: string;
  icon?: string;
  sort: number;
  category_id: string;
  multiple?: boolean;
  required?: boolean;
  adds_price?: boolean;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceGroups {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/service-groups`;

  findAll(): Observable<ServiceGroup[]> {
    return this.http.get<ServiceGroup[]>(
      this.apiUrl,
    );
  }

  create(
    data: CreateServiceGroup,
  ): Observable<ServiceGroup> {
    return this.http.post<ServiceGroup>(
      this.apiUrl,
      data,
    );
  }

  update(
    id: string,
    data: CreateServiceGroup,
  ): Observable<ServiceGroup> {
    return this.http.patch<ServiceGroup>(
      `${this.apiUrl}/${id}`,
      data,
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