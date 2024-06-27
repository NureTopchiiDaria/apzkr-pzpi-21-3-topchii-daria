import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userName: string = '';
  email: string = '';
  password: string = '';
  rePassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegisterSubmit(): void {
    if (this.password !== this.rePassword) {
      console.error('Passwords do not match');
      return;
    }

    const userData = {
      userName: this.userName,
      email: this.email,
      password: this.password,
      rePassword: this.rePassword
    };

    this.authService.register(userData).subscribe(
      response => {
        console.log('Registration successful', response);
        // Navigate to login page or another page after successful registration
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Registration error', error);
      }
    );
  }
}
