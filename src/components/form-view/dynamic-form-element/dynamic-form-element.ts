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

  minYear = "0";
  maxYear = "0";

  constructor() {
    this.setYearsRange();
  }

  onProcessing(event) {
    this.onProcessingEvent.emit(event);
  }

  ngOnInit(){
    this.setElementsStyle()
  }

    // A.S GOC-326
  setElementsStyle(){
    document.documentElement.style.setProperty(`--elements_label_color`, this.form.event_style.elements_label_color);
    document.documentElement.style.setProperty(`--elements_bg_color`,this.hexToRgb(this.form.event_style.element_background_color));
    document.documentElement.style.setProperty(`--elements_bg_opacity`, this.form.event_style.element_background_opacity.toString());
  }

  isControlInvalid() {
    return this.theForm.controls[this.element.identifier] && !this.theForm.controls[this.element.identifier].valid && this.submitAttempt;
  }

  setHour(event) {

  }

  hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
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
