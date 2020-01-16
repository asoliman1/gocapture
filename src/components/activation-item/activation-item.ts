import { Activation } from './../../model/activation';
import { Component, Input } from '@angular/core';
import { Form } from '../../model/form';

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
  
  constructor() {
  }

}
