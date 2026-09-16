import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ApartmentService } from '../../core/apartment';
import { Apartmentdata } from '../../models/apartments.models';
import { Favorite } from '../../models/favorite.models';

@Component({
  selector: 'app-apartment',
  standalone: true,
  imports: [DecimalPipe, RouterLink, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './apartment.html',
  styleUrl: './apartment.scss',
})
export class Apartment implements OnInit {
  public apartmentData = input<Apartmentdata[]>();
  public apartmentService = inject(ApartmentService);
  favourites = signal<Favorite[]>([]);
  public favouriteIds = computed(() => this.favourites().map((fav) => fav.apartmentId));

  private loggedInUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
  ngOnInit(): void {}

  public markAsFavourite(apartment: Apartmentdata): void {
    const favourite = this.favourites().find((fav) => fav.apartmentId === apartment.id);

    // REMOVE FAVOURITE
    if (favourite) {
      this.apartmentService.deleteFavorites(favourite.id!).subscribe({
        next: () => {
          this.favourites.update((favs) => favs.filter((fav) => fav.id !== favourite.id));
        },
        error: (error) => {
          console.error('Failed to remove favourite:', error);
        },
      });

      return;
    }

    // ADD FAVOURITE
    const favoriteData: Favorite = {
      userId: this.loggedInUserId,
      apartmentId: apartment.id,
    };

    this.apartmentService.addFavorites(favoriteData).subscribe({
      next: (response) => {
        this.favourites.update((favs) => [...favs, response]);
      },
      error: (error) => {
        console.error('Failed to add favourite:', error);
      },
    });
  }
}
