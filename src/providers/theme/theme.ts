import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ThemeProvider {

  private theme: BehaviorSubject<String>;
  defaultTheme : string ;

  constructor() {
    this.theme = new BehaviorSubject('default-theme');
  }


  setTempTheme(theme : string){
    theme += '-theme';
    this.theme.next(theme);
  }

  setDefaultTheme(val ?: string){
    this.defaultTheme = val ? `${val}-theme` : this.defaultTheme;
    this.theme.next(this.defaultTheme);
  }

  rmTheme(){
    this.theme.next('default-theme');
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }


}
