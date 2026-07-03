import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at?: string;
}

export interface CreateClient {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Clients {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  findAll() {
    return this.http.get<Client[]>(
      `${this.apiUrl}/clients`,
    );
  }

  create(data: CreateClient) {
    return this.http.post<Client>(
      `${this.apiUrl}/clients`,
      data,
    );
  }

  update(id: string, data: CreateClient) {
    return this.http.patch<Client>(
      `${this.apiUrl}/clients/${id}`,
      data,
    );
  }

  remove(id: string) {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/clients/${id}`,
    );
  }
}