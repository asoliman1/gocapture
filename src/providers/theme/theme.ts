import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ThemeProvider {

  private theme: BehaviorSubject<String>;
  defaultTheme : string;

  constructor() {
    this.theme = new BehaviorSubject('default-theme');
  }


  setActiveTheme(val?) {
    this.defaultTheme = val ? val : 'default-theme';
    this.theme.next(this.defaultTheme);
  }

  setTempTheme(theme : string){
    this.theme.next(theme);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  setDefaultTheme(){
    this.setActiveTheme(this.defaultTheme);
  }

}
