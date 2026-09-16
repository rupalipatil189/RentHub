import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ApartmentService } from '../../core/apartment';
import { Apartmentdata } from '../../models/apartments.models';

@Component({
  selector: 'app-my-listing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-listing.html',
  styleUrl: './my-listing.scss',
})
export class MyListing implements OnInit {
  private apartmentService = inject(ApartmentService);

  public myListings = signal<Apartmentdata[]>([]);

  public loading = signal(true);

  private loggedInUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;

  ngOnInit(): void {
    this.loadMyListings();
  }

  loadMyListings(): void {
    this.loading.set(true);

    this.apartmentService.getAllApartmentsDetail().subscribe({
      next: (apartments) => {
        const myApartments = apartments.filter(
          (apartment) => apartment.ownerId === this.loggedInUserId,
        );

        this.myListings.set(myApartments);

        this.loading.set(false);
      },

      error: (error) => {
        console.error('ERROR LOADING MY LISTINGS:', error);

        this.loading.set(false);
      },
    });
  }

  deleteListing(apartment: Apartmentdata): void {
    const confirmed = confirm(`Are you sure you want to delete "${apartment.title}"?`);

    if (!confirmed) {
      return;
    }

    this.apartmentService.deleteApartment(apartment.id).subscribe({
      next: () => {
        this.myListings.update((listings) => listings.filter((item) => item.id !== apartment.id));
      },

      error: (error) => {
        console.error('error', error);
      },
    });
  }
}
