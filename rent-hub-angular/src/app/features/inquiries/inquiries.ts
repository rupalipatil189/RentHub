import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ApartmentService } from '../../core/apartment';
import { Inquiry } from '../../models/inquiries.models';

@Component({
  selector: 'app-inquiries',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './inquiries.html',
  styleUrl: './inquiries.scss',
})
export class Inquiries implements OnInit {
  private apartmentService = inject(ApartmentService);

  public inquiries = signal<Inquiry[]>([]);

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.id) {
      return;
    }

    this.loadUserInquiries(String(currentUser.id));
  }

  private loadUserInquiries(userId: string): void {
    this.apartmentService.getAllInquiries().subscribe({
      next: (data: Inquiry[]) => {
        const userInquiries = data.filter((inquiry) => String(inquiry.userId) === userId);

        this.inquiries.set(userInquiries);
      },
      error: (error) => {
        console.error('Failed to load inquiries:', error);
      },
    });
  }
}
