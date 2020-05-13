import { Component, Input, forwardRef } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { ActivationElementPage } from '../../../../pages/activation-element';
import { Form, FormElement, FormSubmission } from '../../../../model';
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
  actUrl: string = "";
  retryNotAllowed: boolean = false;
  @Input() element: FormElement;
  @Input() formGroup: FormGroup;
  @Input() form: Form;
  @Input() readonly: boolean = false;
  @Input() isEditing?: boolean;
  @Input() submission?: FormSubmission;

  constructor(private modal: ModalController) {
    super();
  }

  ngOnInit(): void {
    if (this.submission) {
      let gameResult = this.submission.fields[`${this.element.identifier}`] as string;
      if (gameResult) {
        if (typeof gameResult == 'string') this.formGroup.controls[`${this.element.identifier}`].setValue(JSON.parse(gameResult));
        this.retryNotAllowed = true;
      }
    }
     if (this.formGroup.value[`${this.element.identifier}`] && !this.isEditing) {
       if(this.element.is_allow_retry_playing_activation == false) this.retryNotAllowed = true;
    }
  }

  openGame() {
    this.getActivationUrl();
    let gameModal = this.modal.create(ActivationElementPage, { actUrl: this.actUrl }, { cssClass: "modal-fullscreen" });
    gameModal.present()
    gameModal.onDidDismiss((data) => {
      if (data) {
        this.currentVal = data.result;
        this.formGroup.controls[`${this.element.identifier}`].setValue(data.result);
        this.formGroup.controls[`${this.element.identifier}`].markAsDirty();
        if (this.element.is_allow_retry_playing_activation == false) this.retryNotAllowed = true;
      }
    })
  }

  getActivationUrl() {
    this.actUrl = `${this.element.activation.url}&use_prospect_info=1`;
    let formValues = Object.entries(this.formGroup.value);
    for (let i = 0; i < formValues.length; i++) {
      let value = formValues[i];
      let id;
      id = this.form.getIdByUniqueFieldName("Email");
      if (id && id == value[0]) {
        this.assignValueToParameter(value[1], "email");
        continue;
      }

      id = this.form.getIdByFieldType("simple_name");
      if (id && id == value[0]) {
        this.assignValueToParameterName(value[1], value[0]);
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

    }

  }
  assignValueToParameterName(value: any, id) {
    this.actUrl += `&firstname=${value[`${id}_1`]}`;
    this.actUrl += `&lastname=${value[`${id}_2`]}`;
  }
  assignValueToParameter(value, paramater) {
    this.actUrl += `&${paramater}=${value}`
  }

}
