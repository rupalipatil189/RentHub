import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService } from '../../core/apartment';
import { Apartmentdata } from '../../models/apartments.models';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create-apartment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-apartment.html',
  styleUrl: './create-apartment.scss',
})
export class CreateApartment implements OnInit {
  private fb = inject(FormBuilder);
  private apartmentService = inject(ApartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public isEditMode = false;

  public apartmentId!: string;
  public apartmentForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],

    description: ['', [Validators.required, Validators.minLength(20)]],

    location: ['', Validators.required],

    city: ['', Validators.required],

    price: [null, [Validators.required, Validators.min(1)]],

    bedrooms: [null, [Validators.required, Validators.min(1)]],

    bathrooms: [null, [Validators.required, Validators.min(1)]],

    area: [null, [Validators.required, Validators.min(100)]],

    propertyType: ['Apartment', Validators.required],

    furnished: ['', Validators.required],

    images: ['', Validators.required],

    ownerName: ['', Validators.required],

    availableFrom: ['', Validators.required],
  });

  ngOnInit(): void {
    this.apartmentId = String(this.route.snapshot.paramMap.get('id'));

    if (this.apartmentId !== 'null') {
      this.isEditMode = true;

      this.loadApartment(this.apartmentId);
    }
  }

  private loadApartment(id: string): void {
    this.apartmentService.getAllApartmentsDetail().subscribe({
      next: (apartments) => {
        const apartment = apartments.find((item) => item.id === id);

        if (!apartment) {
          console.error('Apartment not found');

          return;
        }
        this.apartmentForm.patchValue({
          title: apartment.title,
          description: apartment.description,
          location: apartment.location,
          city: apartment.city,
          price: apartment.price,
          bedrooms: apartment.bedrooms,
          bathrooms: apartment.bathrooms,
          area: apartment.area,
          propertyType: apartment.propertyType,
          furnished: apartment.furnished,
          amenities: apartment.amenities,
          images: apartment.images.join(', '),
          ownerName: apartment.ownerName,
          ownerId: apartment.ownerId,
          availableFrom: apartment.availableFrom,
        });
      },

      error: (error) => {
        console.error('ERROR LOADING APARTMENT:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.apartmentForm.invalid) {
      this.apartmentForm.markAllAsTouched();

      return;
    }
    const apartmentData = this.apartmentForm.value;

    const apartment: Apartmentdata = {
      ownerId: JSON.parse(localStorage.getItem('currentUser') || '{}').id,
      ...apartmentData,


      images: apartmentData.images
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0),
    };

    if (this.isEditMode) {
      this.apartmentService.updateApartment(this.apartmentId, apartment).subscribe({
        next: () => {
          this.apartmentForm.reset();
          this.router.navigate(['/home']);
        },
        error: () => {
          console.log('error');
        },
      });
    } else {
      this.apartmentService.createApartment(apartment).subscribe({
        next: () => {
          this.apartmentForm.reset();
          this.router.navigate(['/home']);
        },
        error: () => {
          console.log('error');
        },
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.apartmentForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  getControl(controlName: string) {
    return this.apartmentForm.get(controlName);
  }
}
