import { Component } from '@angular/core';
import { NavParams,ViewController } from 'ionic-angular';
import { Form } from "../../model";
import { ThemeProvider } from "../../providers/theme/theme";

@Component({
  selector: 'form-instructions',
  templateUrl: 'form-instructions.html'
})
export class FormInstructions {

  form: Form;
  isModal: boolean = false;
  selectedTheme: String;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    public themeProvider: ThemeProvider) {

    this.form = this.navParams.get("form");
    this.isModal = this.navParams.get("isModal");
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);

  }

  onDismiss() {
    this.viewCtrl.dismiss(null);
  }

}
