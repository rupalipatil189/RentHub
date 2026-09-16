import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/authService';

@Component({
  selector: 'app-navbar',
  imports: [
    [
      CommonModule,
      RouterLink,
      RouterLinkActive,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      MatDividerModule,
    ],
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Get the signal from AuthService
  public currentUser = this.authService.currentUser;

  get isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  get isLandlord(): boolean {
    return this.currentUser()?.role === 'LANDLORD';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
