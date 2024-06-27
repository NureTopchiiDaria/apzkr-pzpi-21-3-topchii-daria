import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { UserRoomService } from '../../services/user-room.service';
import { UserService } from '../../services/user.service';
import { Room } from '../../models/room';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {
  room: Room | undefined;
  admin: UserModel | undefined;
  userId: string;
  center: google.maps.LatLngLiteral;
  zoom: number;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private userRoomService: UserRoomService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId() ?? '';
    this.center = { lat: 0, lng: 0 };
    this.zoom = 8;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roomService.getRoom(id).subscribe((room: Room) => {
        this.room = room;
        this.fetchAdminDetails(room.id);
        this.center = { lat: room.startLocation[1], lng: room.startLocation[0] };
      });
    }
  }

  fetchAdminDetails(roomId: string): void {
    this.userRoomService.getAdminByRoomId(roomId).subscribe((userRoom) => {
      this.userService.getUserById(userRoom.userId).subscribe((user) => {
        this.admin = user;
      });
    });
  }

  joinRoom(): void {
    if (this.room && this.userId) {
      const userData = { userId: this.userId, roomId: this.room?.id };
      this.userRoomService.joinRoom(userData).subscribe({
        next: () => alert('Successfully joined the room'),
        error: (err) => console.error('Error joining the room', err)
      });
    }
  }

  getStartPosition(): google.maps.LatLngLiteral {
    return this.room?.startLocation ? { lat: this.room.startLocation[1], lng: this.room.startLocation[0] } : { lat: 0, lng: 0 };
  }

  getEndPosition(): google.maps.LatLngLiteral {
    return this.room?.endLocation ? { lat: this.room.endLocation[1], lng: this.room.endLocation[0] } : { lat: 0, lng: 0 };
  }
}
