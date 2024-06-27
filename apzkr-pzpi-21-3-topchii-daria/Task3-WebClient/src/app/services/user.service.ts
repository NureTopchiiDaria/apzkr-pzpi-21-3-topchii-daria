import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://localhost:7267/api/User';

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/${userId}`);
  }

  updateUser(user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.baseUrl}/${user.id}`, user);
  }

  uploadProfilePicture(userId: string, formData: FormData): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.baseUrl}/${userId}/upload-profile-picture`, formData);
  }
}
