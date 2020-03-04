import { Activation } from './../../model/activation';
import { Component, Input } from '@angular/core';
import { Form } from '../../model/form';
import { NavController } from 'ionic-angular';
import { ActivationViewPage } from '../../pages/activation-view/activation-view';
import { FormCapture } from '../../views/form-capture';
import { Popup } from './../../providers/popup/popup';
import { BussinessClient } from '../../services/business-service';

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
  
  constructor(private navCtrl : NavController, private popup: Popup,  private client: BussinessClient) {
  }


  presentActionSheet(act : Activation, formName: string){
    let buttons: [any]= [
      {
        'text': 'activations.launch',
        'icon': 'game-controller-b',
        handler : () => {
          if(act.activation_capture_form_after){
            if(this.client.isOnline()) this.navCtrl.push(ActivationViewPage,{activation:{...act}});
            else this.popup.showToast({text:'Check your connection, Please'}, "bottom");
          }
          else this.navCtrl.push(FormCapture,{activation:act,form:this.form});
        }
      }
    ]

    buttons.push({
      text: 'general.cancel',
      role: 'cancel',
      handler: () => {
        //console.log('Cancel clicked');
      }
    });

    this.popup.showActionSheet(formName,buttons);
  }
  
}
