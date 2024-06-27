import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { CreateRoom } from '../../models/room.create';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css']
})
export class AddRoomComponent implements OnInit {
  room: CreateRoom = {
    userId: '',
    name: '',
    isApproved: false,
    startLocation: [0, 0], // Array for coordinates
    endLocation: [0, 0], // Array for coordinates
    tripLength: 0,
    dateTime: '',
    information: ''
  };

  @ViewChild('startLocationInput') startLocationInput!: ElementRef;
  @ViewChild('endLocationInput') endLocationInput!: ElementRef;

  center: google.maps.LatLngLiteral = { lat: 51.678418, lng: 7.809007 };
  zoom = 8;
  startLocation: google.maps.LatLngLiteral | undefined;
  endLocation: google.maps.LatLngLiteral | undefined;
  selectingStartLocation = true;

  constructor(
    private roomService: RoomService, 
    private authService: AuthService,
    private router: Router // Inject the Router service
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.initAutocomplete(), 1000); // Ensure DOM is ready
    this.setUserId();
    this.setInitialDateTime();
  }

  initAutocomplete(): void {
    const autocompleteStart = new google.maps.places.Autocomplete(this.startLocationInput.nativeElement);
    const autocompleteEnd = new google.maps.places.Autocomplete(this.endLocationInput.nativeElement);

    autocompleteStart.addListener('place_changed', () => {
      const place = autocompleteStart.getPlace();
      if (place.geometry && place.geometry.location) {
        this.room.startLocation = [place.geometry.location.lng(), place.geometry.location.lat()];
        this.startLocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      }
    });

    autocompleteEnd.addListener('place_changed', () => {
      const place = autocompleteEnd.getPlace();
      if (place.geometry && place.geometry.location) {
        this.room.endLocation = [place.geometry.location.lng(), place.geometry.location.lat()];
        this.endLocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
      }
    });
  }

  setUserId(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.room.userId = userId;
    } else {
      console.error('User ID not found!');
    }
  }

  setInitialDateTime(): void {
    const now = new Date();
    this.room.dateTime = this.formatDateTimeLocal(now);
  }

  formatDateTimeLocal(date: Date): string {
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset); 
    return date.toISOString().slice(0, 16); 
  }

  mapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const position = [event.latLng.lng(), event.latLng.lat()];

      if (this.selectingStartLocation) {
        this.room.startLocation = position;
        this.startLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        this.selectingStartLocation = false;
      } else {
        this.room.endLocation = position;
        this.endLocation = { lat: event.latLng.lat(), lng: event.latLng.lng() };
        this.selectingStartLocation = true;
      }
    }
  }

  onSubmit(): void {
    this.roomService.addRoom(this.room).subscribe(() => {
      const lang = this.router.url.split('/')[1]; 
      this.router.navigate([`${lang}/rooms`]); 
      console.log('Room added successfully');
    });
  }
}
