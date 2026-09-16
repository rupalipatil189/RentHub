import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Apartmentdata } from '../models/apartments.models';
import { Favorite } from '../models/favorite.models';
import { CommentData } from '../models/comment.models';
import { Inquiry } from '../models/inquiries.models';

@Injectable({
  providedIn: 'root',
})
export class ApartmentService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getAllApartmentsDetail(): Observable<Apartmentdata[]> {
    return this.httpClient.get<Apartmentdata[]>(this.apiUrl + '/apartments');
  }

  public getApartmentById(id: string) {
    return this.httpClient.get<Apartmentdata>(`${this.apiUrl + '/apartments'}/${id}`);
  }

  createApartment(apartment: Apartmentdata): Observable<Apartmentdata> {
    return this.httpClient.post<Apartmentdata>(`${this.apiUrl + '/apartments'}`, apartment);
  }

  updateApartment(id: string, apartment: Apartmentdata): Observable<Apartmentdata> {
    return this.httpClient.put<Apartmentdata>(`${this.apiUrl}/apartments/${id}`, apartment);
  }

  deleteApartment(apartmentId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/apartments/${apartmentId}`);
  }

  addFavorites(apartment: Favorite): Observable<Favorite> {
    return this.httpClient.post<Favorite>(`${this.apiUrl + '/favorites'}`, apartment);
  }

  deleteFavorites(favoriteId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/favorites/${favoriteId}`);
  }

  getAllFavorites(): Observable<Favorite[]> {
    return this.httpClient.get<Favorite[]>(`${this.apiUrl}/favorites`);
  }

  addComment(comment: any): Observable<CommentData> {
    return this.httpClient.post<CommentData>(`${this.apiUrl + '/comments'}`, comment);
  }

  getAllComments(): Observable<CommentData[]> {
    return this.httpClient.get<CommentData[]>(`${this.apiUrl + '/comments'}`);
  }

  addInquiry(inquiry: any): Observable<Inquiry> {
    return this.httpClient.post<Inquiry>(`${this.apiUrl + '/inquiries'}`, inquiry);
  }

  getAllInquiries(): Observable<Inquiry[]> {
    return this.httpClient.get<Inquiry[]>(`${this.apiUrl + '/inquiries'}`);
  }
}
