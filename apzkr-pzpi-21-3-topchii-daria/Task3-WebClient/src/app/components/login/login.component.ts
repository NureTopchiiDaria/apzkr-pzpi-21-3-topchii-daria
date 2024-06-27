import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLoginSubmit(): void {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log('Login successful', response);
        const lang = this.router.url.split('/')[1]; 
        this.router.navigate([`${lang}/rooms`]); 
      },
      (error: any) => {
        console.error('Login error', error);
      }
    );
  }
}
