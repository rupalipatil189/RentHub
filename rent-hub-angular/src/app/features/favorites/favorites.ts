import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApartmentService } from '../../core/apartment';
import { Favorite } from '../../models/favorite.models';
import { Apartmentdata } from '../../models/apartments.models';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [MatIconModule, MatCardModule, MatButtonModule, DecimalPipe, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites implements OnInit {
  public apartmentService = inject(ApartmentService);
  public favoriteApartments = signal<Apartmentdata[]>([]);
  public userFavorites: Favorite[] = [];
  private loggedInUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id;
  favourites = signal<Favorite[]>([]);
  public favouriteIds = computed(() => this.favourites().map((fav) => fav.apartmentId));

  ngOnInit(): void {
    this.apartmentService.getAllFavorites().subscribe((data) => {
      this.userFavorites = data.filter(
        (favorite) => String(favorite.userId) === String(this.loggedInUserId),
      );
      this.loadFavoriteApartments(this.userFavorites);
    });
  }

  public loadFavoriteApartments(favorites: Favorite[]) {
    if (favorites.length === 0) {
      this.favoriteApartments.set([]);
      return;
    }

    this.apartmentService.getAllApartmentsDetail().subscribe((data) => {
      const favoriteApartments = data.filter((apartment) =>
        favorites.some((favorite) => favorite.apartmentId === apartment.id),
      );

      this.favoriteApartments.set(favoriteApartments);
    });
  }
}
