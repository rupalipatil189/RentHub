import { Component, inject, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ApartmentService } from '../../core/apartment';
import { Apartmentdata } from '../../models/apartments.models';
import { Apartment } from '../apartment/apartment';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Apartment, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private apartmentService = inject(ApartmentService);

  public apartmentData = signal<Apartmentdata[]>([]);

  public filteredApartments = signal<Apartmentdata[]>([]);

  public currentSlide = signal(0);
  // Search / Filter values
  public searchText = '';
  public selectedLocation = '';
  public minPrice: number | null = null;
  public maxPrice: number | null = null;
  public selectedBedrooms = '';
  public selectedPropertyType = '';
  public selectedFurnished = '';
  public selectedAmenities: string[] = [];
  public sortBy = '';

  ngOnInit(): void {
    this.apartmentService.getAllApartmentsDetail().subscribe({
      next: (data) => {
        this.apartmentData.set(data);
        this.filteredApartments.set(data);
      },

      error: (error) => {
        console.error('API ERROR:', error);
      },
    });
  }

  nextSlide(): void {
    const apartments = this.apartmentData();

    if (apartments.length === 0) {
      return;
    }

    this.currentSlide.update((index) => (index === apartments.length - 1 ? 0 : index + 1));
  }

  previousSlide(): void {
    const apartments = this.apartmentData();

    if (apartments.length === 0) {
      return;
    }

    this.currentSlide.update((index) => (index === 0 ? apartments.length - 1 : index - 1));
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }

  // =========================
  // SEARCH + FILTER
  // =========================

  applyFilters(): void {
    let result = [...this.apartmentData()];

    // Search

    if (this.searchText.trim()) {
      const search = this.searchText.trim().toLowerCase();

      result = result.filter(
        (apartment) =>
          apartment.title.toLowerCase().includes(search) ||
          apartment.location.toLowerCase().includes(search) ||
          apartment.city.toLowerCase().includes(search) ||
          apartment.description.toLowerCase().includes(search),
      );
    }

    // Location

    if (this.selectedLocation) {
      result = result.filter((apartment) => apartment.location === this.selectedLocation);
    }

    // Minimum price

    if (this.minPrice !== null) {
      result = result.filter((apartment) => apartment.price >= this.minPrice!);
    }

    // Maximum price

    if (this.maxPrice !== null) {
      result = result.filter((apartment) => apartment.price <= this.maxPrice!);
    }

    // Bedrooms

    if (this.selectedBedrooms) {
      result = result.filter((apartment) => apartment.bedrooms === Number(this.selectedBedrooms));
    }

    // Property type

    if (this.selectedPropertyType) {
      result = result.filter((apartment) => apartment.propertyType === this.selectedPropertyType);
    }

    // Furnished

    if (this.selectedFurnished) {
      result = result.filter((apartment) => apartment.furnished === this.selectedFurnished);
    }

    // Amenities

    // if (this.selectedAmenities.length > 0) {

    //   result = result.filter(apartment =>

    //     this.selectedAmenities.every(
    //       amenity =>
    //         apartment.amenities.includes(amenity)
    //     )

    //   );

    // }

    // Sorting

    if (this.sortBy === 'priceLowHigh') {
      result.sort((a, b) => a.price - b.price);
    }

    if (this.sortBy === 'priceHighLow') {
      result.sort((a, b) => b.price - a.price);
    }

    this.filteredApartments.set(result);

    // Reset carousel
    this.currentSlide.set(0);
  }

  // =========================
  // AMENITIES
  // =========================

  toggleAmenity(amenity: string): void {
    if (this.selectedAmenities.includes(amenity)) {
      this.selectedAmenities = this.selectedAmenities.filter((item) => item !== amenity);
    } else {
      this.selectedAmenities = [...this.selectedAmenities, amenity];
    }

    this.applyFilters();
  }

  // =========================
  // CLEAR
  // =========================

  clearFilters(): void {
    this.searchText = '';

    this.selectedLocation = '';

    this.minPrice = null;

    this.maxPrice = null;

    this.selectedBedrooms = '';

    this.selectedPropertyType = '';

    this.selectedFurnished = '';

    this.selectedAmenities = [];

    this.sortBy = '';

    this.filteredApartments.set(this.apartmentData());
  }

  // =========================
  // CAROUSEL
  // =========================
}
