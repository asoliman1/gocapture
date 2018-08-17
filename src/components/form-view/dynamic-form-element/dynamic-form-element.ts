import {Component, Input} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormElement} from "../../../model/form-element";
import {FormView} from "../form-view";
import {Form} from "../../../model/form";

@Component({
  selector: 'dynamic-form-element',
  templateUrl: 'dynamic-form-element.html'
})
export class DynamicFormElementComponent {

  @Input() theForm: FormGroup;
  @Input() element: FormElement;
  @Input() submitAttempt: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() form: Form;

  constructor() {
    //
  }

  isControlInvalid() {
    return !this.theForm.controls[this.element.identifier].valid && this.submitAttempt;
  }

}
