import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: UserModel | undefined;
  selectedFile: File | null = null;

  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe((user) => {
        this.user = user;
      });
    }
  }

  updateUserProfile(): void {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe({
        next: () => alert('Profile updated successfully'),
        error: (err) => console.error('Error updating profile', err)
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadProfilePicture();
    }
  }

  uploadProfilePicture(): void {
    if (this.user && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.userService.uploadProfilePicture(this.user.id, formData).subscribe({
        next: (user) => {
          this.user = user;
          this.selectedFile = null;
        },
        error: (err) => console.error('Error uploading profile picture', err)
      });
    }
  }

  navigateToMyJourneys(): void {
    const lang = this.router.url.split('/')[1];
    this.router.navigate([`/${lang}/my-journeys`]);
  }
}
