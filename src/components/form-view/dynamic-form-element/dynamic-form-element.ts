import { ElementRef, ViewChild } from '@angular/core';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormElement} from "../../../model";
import {Form} from "../../../model";
import {FormSubmission} from "../../../model";

@Component({
  selector: 'dynamic-form-element',
  templateUrl: 'dynamic-form-element.html'
})
export class DynamicFormElementComponent {

  @Input() theForm: FormGroup;
  @Input() element: FormElement;
  @Input() submitAttempt: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() form: Form;
  @Input() submission: FormSubmission;

  @Output() onProcessingEvent = new EventEmitter();
  @ViewChild('dynamicForm') el:ElementRef;


  constructor() {
  }

  onProcessing(event) {
    this.onProcessingEvent.emit(event);
  }

  ngOnInit(){
    this.setFormLabelColor()
    this.setItemBackground()
  }
  
    // A.S GOC-326
  setFormLabelColor(){
    document.documentElement.style.setProperty(`--elements_label_color`, this.form.event_style.elements_label_color);
  }

    // A.S GOC-353
  setItemBackground(){
    document.documentElement.style.setProperty(`--elements_background_color`, this.form.event_style.capture_background_color);
  }

  isControlInvalid() {
    return this.theForm.controls[this.element.identifier] && !this.theForm.controls[this.element.identifier].valid && this.submitAttempt;
  }

  setHour(event) {

  }

  setDate(event) {
    //console.log(event);
  }

}
