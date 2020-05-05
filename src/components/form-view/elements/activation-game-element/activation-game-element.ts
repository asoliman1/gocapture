import { Component, Input, forwardRef } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ActivationElementPage } from '../../../../pages/activation-element';
import { Form, FormElement } from '../../../../model';
import { BaseElement } from '../base-element';
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms"

/**
 * Generated class for the ActivationGameElementComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'activation-game-element',
  templateUrl: 'activation-game-element.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ActivationGameElementComponent), multi: true }
  ]
})
export class ActivationGameElementComponent extends BaseElement {
  acturl = "https://demo.leadliaison.com/Activations/PICK_A_WINNER/index.php?token=mzX3GSH3t3VGMA3VM&use_prospect_info=1";
  @Input() element: FormElement;
  @Input() formGroup: FormGroup;
  @Input() form: Form;
  @Input() readonly: boolean = false;
  //@Input() isEditing?: boolean;
  gameResult: any;

  constructor(private modal: ModalController) {
    super();
  }

  openGame() {
    this.getActivationUrl();
    let gameModal = this.modal.create(ActivationElementPage, { actUrl: this.acturl }, { cssClass: "modal-fullscreen" });
    gameModal.present()
    gameModal.onDidDismiss((data) => {
      console.log("result", data);
      this.currentVal = data;
    })
  }

  getActivationUrl() {
    let formValues = Object.entries(this.formGroup.value);
    for (let i = 0; i < formValues.length; i++) {
      let value = formValues[i];
      let id;
      id = this.form.getIdByUniqueFieldName("Email");
      if (id && id == value[0]) {
        this.assignValueToParameter(value[1], "email");
        continue;
      }

      id = this.form.getIdByUniqueFieldName("WorkPhone");
      if (id && id == value[0]) {
        this.assignValueToParameter(value[1], "phone");
        continue;
      }

      id = this.form.getIdByUniqueFieldName("JobTitle");
      if (id && id == value[0]) {
        this.assignValueToParameter(value[1], "jobtitle");
        continue;
      }

      id = this.form.getIdByUniqueFieldName("Company");
      if (id && id == value[0]) {
        this.assignValueToParameter(value[1], "company");
        continue;
      }

      id = this.form.getIdByFieldType("url");
      if (id && id == value[0]) {
        this.assignValueToParameter(value[1], "website");
        continue;
      }

      id = this.form.getIdByFieldType("simple_name");
      if (id && id == value[0]) {
        this.assignValueToParameterName(value[1], value[0]);
        continue;
      }

    }

  }
  assignValueToParameterName(value: any, id){
    this.acturl += `&firstname=${value[`${id}_1`]}` ;
    this.acturl += `&lastname=${value[`${id}_2`]}` ;
  }
  assignValueToParameter(value, paramater){
    this.acturl += `&${paramater}=${value}` 
  }

}
