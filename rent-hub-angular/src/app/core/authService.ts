import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  

  private currentUserSignal = signal<User | null>(
    this.getUserFromStorage()
  );
  public currentUser = this.currentUserSignal.asReadonly();

  constructor(private httpClient: HttpClient) {}
  
   private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));

    // This is what makes the navbar update immediately
    this.currentUserSignal.set(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');

    // Update signal as well
    this.currentUserSignal.set(null);
  }

  login(email: string, password: string): Observable<User[]> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.httpClient.get<User[]>(
      this.apiUrl + '/users',
      { params }
    );
  }

  checkEmailExists(email: string): Observable<User[]> {
    const params = new HttpParams().set('email', email);

    return this.httpClient.get<User[]>(this.apiUrl + '/users', { params });
  }

  register(user: User): Observable<User> {
    return this.httpClient.post<User>(this.apiUrl + '/users', user);
  }
}
