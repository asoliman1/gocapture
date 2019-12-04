import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()

export class TranslateConfigService {

    constructor(private translate: TranslateService) { }

    setLanguage(lang) {
        this.translate.setDefaultLang(lang);
        this.translate.use(lang);
    }

    initTranslate() {
        console.log('reaching init translate');

        if (this.translate.getBrowserLang() !== undefined) {
            console.log('getting browser language', this.translate.getBrowserLang());
            this.translate.setDefaultLang(this.translate.getBrowserLang());
        } else {
            this.translate.setDefaultLang('en');
        }
    }

}
