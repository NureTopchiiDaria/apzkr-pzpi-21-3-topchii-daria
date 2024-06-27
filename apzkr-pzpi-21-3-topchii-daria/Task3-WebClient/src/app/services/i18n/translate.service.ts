import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppTranslationService {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    if (browserLang && browserLang.match(/en|ukr/)) {
      translate.use(browserLang);
    } else {
      translate.use('en');
    }
  }

  changeLanguage(language: string) {
    this.translate.use(language);
  }
}
