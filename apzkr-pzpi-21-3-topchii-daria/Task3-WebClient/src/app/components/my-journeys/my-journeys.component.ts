import { Component, OnInit } from '@angular/core';
import { UserRoomService } from '../../services/user-room.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserRoom } from '../../models/user-room.model';

@Component({
  selector: 'app-my-journeys',
  templateUrl: './my-journeys.component.html',
  styleUrls: ['./my-journeys.component.css']
})
export class MyJourneysComponent implements OnInit {
  userRooms: UserRoom[] = [];

  constructor(
    private userRoomService: UserRoomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userRoomService.getUserRooms(userId).subscribe({
        next: (userRooms: UserRoom[]) => {
          this.userRooms = userRooms;
        },
        error: (err: any) => {
          console.error('Error fetching user rooms', err);
        }
      });
    }
  }
}
