import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ServiceCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceCategories {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/service-categories`;

  findAll(): Observable<ServiceCategory[]> {
    return this.http.get<ServiceCategory[]>(this.apiUrl);
  }
}