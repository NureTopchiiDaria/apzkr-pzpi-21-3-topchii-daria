import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'travel-platform';
  isLoggedIn: boolean = false;
  currentLang: string;

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private translate: TranslateService
  ) {
    translate.addLangs(['en', 'ukr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    this.currentLang = browserLang && browserLang.match(/en|ukr/) ? browserLang : 'en';
    translate.use(this.currentLang);
  }

  switchLanguage(language: string) {
    const currentLang = this.router.url.split('/')[1];
    const newUrl = this.router.url.replace(`/${currentLang}`, `/${language}`);
    this.router.navigateByUrl(newUrl);
    this.translate.use(language);
    this.currentLang = language;
  }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  logout(): void {
    const lang = this.router.url.split('/')[1];
    this.authService.logout();
    this.router.navigate([`/${lang}/login`]);
  }
}
