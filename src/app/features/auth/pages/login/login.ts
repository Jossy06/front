import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  loading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

onSubmit() {
  const email = this.loginForm.value.email?.trim() ?? '';
  const password = this.loginForm.value.password ?? '';

  this.loginForm.patchValue({
    email,
    password,
  });

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;

  this.auth.login({
    email,
    password,
  }).subscribe({
    next: (response) => {
      this.auth.saveSession(response);

      Swal.fire({
        icon: 'success',
        title: 'Bienvenida',
        text: 'Inicio de sesión correcto',
        timer: 1200,
        showConfirmButton: false,
      });

      this.router.navigate(['/dashboard']);
    },
    error: () => {
      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo o contraseña incorrectos',
      });
    },
  });
}
}