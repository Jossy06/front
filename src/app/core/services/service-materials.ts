import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Service } from './services';
import { Material } from './materials';

export interface ServiceMaterial {
  id: string;
  service_id: string;
  material_id: string;
  quantity: number;
  service?: Service;
  material?: Material;
}

export interface CreateServiceMaterial {
  service_id: string;
  material_id: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceMaterials {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/service-materials`;

  findAll(): Observable<ServiceMaterial[]> {
    return this.http.get<ServiceMaterial[]>(this.apiUrl);
  }

  create(data: CreateServiceMaterial): Observable<ServiceMaterial> {
    return this.http.post<ServiceMaterial>(this.apiUrl, data);
  }

  update(
    id: string,
    data: CreateServiceMaterial,
  ): Observable<ServiceMaterial> {
    return this.http.patch<ServiceMaterial>(
      `${this.apiUrl}/${id}`,
      data,
    );
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}