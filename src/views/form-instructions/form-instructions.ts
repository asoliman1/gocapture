import {Component} from '@angular/core';
import {
  NavController,
  NavParams,

} from 'ionic-angular';
import {Form} from "../../model";
import {ViewController} from "ionic-angular/navigation/view-controller";
import {LocalStorageProvider} from "../../providers/local-storage/local-storage";


@Component({
  selector: 'form-instructions',
  templateUrl: 'form-instructions.html'
})
export class FormInstructions {

  form: Form;
  isModal: boolean = false;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private localStorage: LocalStorageProvider) {
    this.form = this.navParams.get("form");
    this.isModal = this.navParams.get("isModal");
  }

  onDismiss() {
    this.viewCtrl.dismiss(null);
  }

}
