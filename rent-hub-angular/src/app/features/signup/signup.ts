import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/authService';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return {
      passwordMismatch: true,
    };
  }

  return null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public errorMessage = signal('');
  public successMessage = signal('');

  public hidePassword = signal(true);
  public hideConfirmPassword = signal(true);

  signupForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],

      email: ['', [Validators.required, Validators.email]],

      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required],

      role: ['TENANT', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    },
  );

  register(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();

      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    const formValue = this.signupForm.getRawValue();

    const user = {
      name: formValue.name!,
      email: formValue.email!,
      phone: formValue.phone!,
      password: formValue.password!,
      role: formValue.role as 'TENANT' | 'LANDLORD',
    };
    // Check whether email already exists
    this.authService.checkEmailExists(user.email).subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.isLoading.set(false);
          this.errorMessage.set('An account with this email already exists.');
          return;
        }

        // Create user
        this.authService.register(user).subscribe({
          next: (createdUser) => {
            this.isLoading.set(false);
            this.successMessage.set('Registration successful! Redirecting to login...');

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          },

          error: (error) => {
            console.error('REGISTRATION ERROR:', error);

            this.isLoading.set(false);

            this.errorMessage.set('Unable to create account. Please try again.');
          },
        });
      },

      error: (error) => {
        console.error('EMAIL CHECK ERROR:', error);
        this.isLoading.set(false);
        this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }

  togglePassword(): void {
    this.hidePassword.update((value) => !value);
  }

  toggleConfirmPassword(): void {
    this.hideConfirmPassword.update((value) => !value);
  }

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }

  get phone() {
    return this.signupForm.get('phone');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  get role() {
    return this.signupForm.get('role');
  }
}
