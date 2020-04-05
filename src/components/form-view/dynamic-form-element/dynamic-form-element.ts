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
  @Input() activation : boolean;
  @Output() onProcessingEvent = new EventEmitter();
  @Output() doSubmit = new EventEmitter();
  @ViewChild('dynamicForm') el:ElementRef;

  minYear = "0";
  maxYear = "0";

  constructor() {
    this.setYearsRange();
  }

  onProcessing(event) {
    this.onProcessingEvent.emit(event);
  }

  canSubmitForm(event){
    this.doSubmit.emit(event);
  }

  ngOnInit(){
    this.setElementsStyle()
  }

    // A.S GOC-326
  setElementsStyle(){
    document.documentElement.style.setProperty(`--elements_label_color`, this.form.event_style.elements_label_color);
    document.documentElement.style.setProperty(`--elements_bg_color`,this.hexToRgb(this.form.event_style.element_background_color));
    document.documentElement.style.setProperty(`--elements_bg_opacity`, this.form.event_style.element_background_opacity+'');
  }

  isControlInvalid() {
    return this.theForm.controls[this.element.identifier] && !this.theForm.controls[this.element.identifier].valid && this.submitAttempt;
  }
  

  setHour(event) {

  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let rgb = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;

    return rgb ? `${rgb.r},${rgb.g},${rgb.b}` : '0,0,0';
}

  setDate(event) {
    //console.log(event);
  }

  setYearsRange() {
    var d = new Date();
    var year = d.getFullYear();
    this.minYear = (year - 10) + '';
    this.maxYear = (year + 10) + '';
  }
}
