import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7267'; 
  public loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn.next(!!localStorage.getItem('authToken'));
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('userId'); 
    this.loggedIn.next(false);
    this.router.navigate(['/login']); 
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Login`, credentials).pipe(
      tap(response => {
        if (response.token && response.userId) { 
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userId', response.userId); 
          this.loggedIn.next(true);
        }
      })
    );
  }

  register(userData: { userName: string, email: string, password: string, rePassword: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Registration`, userData); 
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
