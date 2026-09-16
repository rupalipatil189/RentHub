import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';

import { ApartmentService } from './apartment';
import { Apartmentdata } from '../models/apartments.models';
import { Favorite } from '../models/favorite.models';
import { CommentData } from '../models/comment.models';
import { Inquiry } from '../models/inquiries.models';
import { environment } from '../../environments/environment';

describe('ApartmentService', () => {
  let service: ApartmentService;
  let httpTestingController: HttpTestingController;

  const apiUrl = environment.apiUrl;

  const mockApartment = {
    id: '1',
    ownerId: '2',
    title: 'Modern 1 BHK',
    description: 'Beautiful apartment in Hinjewadi',
    city: 'Pune',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    propertyType: 'Apartment',
    price: 15000,
    availableFrom: '2026-09-01',
  } as Apartmentdata;

  const mockApartments: Apartmentdata[] = [
    mockApartment,
    {
      ...mockApartment,
      id: '2',
      title: '2 BHK Apartment',
    },
  ];

  const mockFavorite = {
    id: '1',
    apartmentId: '1',
    userId: '10',
  } as Favorite;

  const mockComment = {
    id: '1',
    apartmentId: '1',
    userId: '10',
    userName: 'Rupali',
    text: 'Nice apartment',
    createdAt: '2026-08-25T10:00:00Z',
  } as CommentData;

  const mockInquiry = {
    id: '1',
    apartmentId: '1',
    userId: '10',
    userName: 'Rupali',
    ownerId: '2',
    message: 'I am interested in this apartment',
    createdAt: '2026-08-25T10:00:00Z',
  } as Inquiry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApartmentService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApartmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // =====================================================
  // Service creation
  // =====================================================

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // =====================================================
  // getAllApartmentsDetail
  // =====================================================

  it('should get all apartments', () => {
    service.getAllApartmentsDetail().subscribe((apartments) => {
      expect(apartments).toEqual(mockApartments);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/apartments`);

    expect(request.request.method).toBe('GET');

    request.flush(mockApartments);
  });

  // =====================================================
  // getApartmentById
  // =====================================================

  it('should get apartment by id', () => {
    service.getApartmentById('1').subscribe((apartment) => {
      expect(apartment).toEqual(mockApartment);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/apartments/1`);

    expect(request.request.method).toBe('GET');

    request.flush(mockApartment);
  });

  // =====================================================
  // createApartment
  // =====================================================

  it('should create an apartment', () => {
    service.createApartment(mockApartment).subscribe((apartment) => {
      expect(apartment).toEqual(mockApartment);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/apartments`);

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(mockApartment);

    request.flush(mockApartment);
  });

  // =====================================================
  // updateApartment
  // =====================================================

  it('should update an apartment', () => {
    const updatedApartment = {
      ...mockApartment,
      title: 'Updated Apartment',
      price: 18000,
    };

    service.updateApartment('1', updatedApartment).subscribe((apartment) => {
      expect(apartment).toEqual(updatedApartment);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/apartments/1`);

    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual(updatedApartment);

    request.flush(updatedApartment);
  });

  // =====================================================
  // deleteApartment
  // =====================================================

  it('should delete an apartment', () => {
    service.deleteApartment('1').subscribe((response) => {
      expect(response).toBeNull();
    });

    const request = httpTestingController.expectOne(`${apiUrl}/apartments/1`);

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  // =====================================================
  // addFavorites
  // =====================================================

  it('should add a favorite', () => {
    service.addFavorites(mockFavorite).subscribe((favorite) => {
      expect(favorite).toEqual(mockFavorite);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/favorites`);

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(mockFavorite);

    request.flush(mockFavorite);
  });

  // =====================================================
  // deleteFavorites
  // =====================================================

  it('should delete a favorite', () => {
    service.deleteFavorites('1').subscribe();

    const request = httpTestingController.expectOne(`${apiUrl}/favorites/1`);

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  // =====================================================
  // getAllFavorites
  // =====================================================

  it('should get all favorites', () => {
    const favorites: Favorite[] = [
      mockFavorite,
      {
        ...mockFavorite,
        id: '2',
        apartmentId: '2',
      },
    ];

    service.getAllFavorites().subscribe((response) => {
      expect(response).toEqual(favorites);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/favorites`);

    expect(request.request.method).toBe('GET');

    request.flush(favorites);
  });

  // =====================================================
  // addComment
  // =====================================================

  it('should add a comment', () => {
    service.addComment(mockComment).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/comments`);

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(mockComment);

    request.flush(mockComment);
  });

  // =====================================================
  // getAllComments
  // =====================================================

  it('should get all comments', () => {
    const comments: CommentData[] = [
      mockComment,
      {
        ...mockComment,
        id: '2',
        apartmentId: '2',
        text: 'Very nice',
      },
    ];

    service.getAllComments().subscribe((response) => {
      expect(response).toEqual(comments);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/comments`);

    expect(request.request.method).toBe('GET');

    request.flush(comments);
  });

  // =====================================================
  // addInquiry
  // =====================================================

  it('should add an inquiry', () => {
    service.addInquiry(mockInquiry).subscribe((inquiry) => {
      expect(inquiry).toEqual(mockInquiry);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/inquiries`);

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual(mockInquiry);

    request.flush(mockInquiry);
  });

  // =====================================================
  // getAllInquiries
  // =====================================================

  it('should get all inquiries', () => {
    const inquiries: Inquiry[] = [
      mockInquiry,
      {
        ...mockInquiry,
        id: '2',
        apartmentId: '2',
        message: 'I want to visit this apartment',
      },
    ];

    service.getAllInquiries().subscribe((response) => {
      expect(response).toEqual(inquiries);
    });

    const request = httpTestingController.expectOne(`${apiUrl}/inquiries`);

    expect(request.request.method).toBe('GET');

    request.flush(inquiries);
  });
});
