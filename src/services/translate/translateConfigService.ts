import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from 'ionic-angular';

@Injectable()

export class TranslateConfigService {

    constructor(private translate: TranslateService,private platform : Platform) { }

    setLanguage(lang) {
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
        this.platform.setDir(lang == 'ar' ? 'rtl' : 'ltr',true);
    }

    defaultLanguage() {
      if (this.translate.getBrowserLang() !== undefined) {
        return this.translate.getBrowserLang();
      }
      return "en";
    }

    initTranslate() {
        let def = this.defaultLanguage();
        this.translate.setDefaultLang(def);
        this.platform.setDir(def == 'ar' ? 'rtl' : 'ltr',true);
    }

}
