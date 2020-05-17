import {Component} from '@angular/core';
import {
  NavController,
  NavParams,

} from 'ionic-angular';
import {Form} from "../../model";
import {ViewController} from "ionic-angular/navigation/view-controller";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";
import {ThemeProvider} from "../../providers/theme/theme";
import { Activation } from '../../model/activation';


@Component({
  selector: 'form-instructions',
  templateUrl: 'form-instructions.html'
})
export class FormInstructions {

  form: Form;
  activation: Activation
  isModal: boolean = false;
  selectedTheme: String;
  instructionName: string;
  instructionsContent: string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              public themeProvider: ThemeProvider) {
    this.form = this.navParams.get("form");
    this.activation = this.navParams.get("activation");
    this.isModal = this.navParams.get("isModal");
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
    if(this.activation) {
      this.instructionName = this.activation.name;
      this.instructionsContent = this.activation.instructions_content;
    }
    else {
      this.instructionName = this.form.name;
      this.instructionsContent = this.form.instructions_content;
    }
  }

  onDismiss() {
    this.viewCtrl.dismiss(null);
  }

}
