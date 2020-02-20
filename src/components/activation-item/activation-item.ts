import { Activation } from './../../model/activation';
import { Component, Input } from '@angular/core';
import { Form } from '../../model/form';
import { NavController } from 'ionic-angular';
import { ActivationViewPage } from '../../pages/activation-view/activation-view';
import { FormCapture } from '../../views/form-capture';

/**
 * Generated class for the ActivationItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'activation-item',
  templateUrl: 'activation-item.html'
})
export class ActivationItemComponent {

  @Input() activations : [Activation];
  @Input() form : Form;
  
  constructor(private navCtrl : NavController) {
  }


  navigate(act : Activation){
    if(act.activation_capture_form_after)
    this.navCtrl.push(ActivationViewPage,{activation:{...act}});
    else this.navCtrl.push(FormCapture,{activation:act,form:this.form});
  }
  
}
