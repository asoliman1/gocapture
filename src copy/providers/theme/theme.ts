import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ThemeProvider {

  private theme: BehaviorSubject<String>;

  constructor() {
    this.theme = new BehaviorSubject('default-theme');
  }

  setActiveTheme(val?) {
    this.theme.next(val ? val : 'default-theme');
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }


}
