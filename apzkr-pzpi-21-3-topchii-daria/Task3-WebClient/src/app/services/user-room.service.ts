import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRoom } from '../models/user-room.model';

@Injectable({
  providedIn: 'root'
})
export class UserRoomService {
  private baseUrl = 'https://localhost:7267/api/UserRoom';

  constructor(private http: HttpClient) {}

  getAdminByRoomId(roomId: string): Observable<UserRoom> {
    return this.http.get<UserRoom>(`${this.baseUrl}/admin/${roomId}`);
  }

  joinRoom(userData: { userId: string, roomId: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/add`, userData);
  }

  getUserRooms(userId: string): Observable<UserRoom[]> {
    return this.http.get<UserRoom[]>(`${this.baseUrl}/user/${userId}`);
  }
}
