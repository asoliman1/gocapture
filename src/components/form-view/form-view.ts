import { OcrSelector } from '../ocr-selector';
import { Component, NgZone, Input, SimpleChange, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import {
  Form,
  BarcodeStatus,
  FormElement,
  DeviceFormMembership,
  FormSubmission,
  FormElementType,
} from "../../model";
import { ValidatorFn, FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from '../../util/validator';
import { Subscription } from "rxjs/Subscription";
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import {ModalController} from "ionic-angular";

@Component({
  selector: 'form-view',
  templateUrl: 'form-view.html'
})
export class FormView {

  @Input() form: Form;
  @Input() submission: FormSubmission;
  @Input() prospect: DeviceFormMembership;
  @Output() onChange = new EventEmitter();
  @Output() onValidationChange = new EventEmitter();
  @Output() onProcessingEvent = new EventEmitter();

  @Input() readOnly: boolean = false;
  @Input() isEditing: boolean = false;

  @Input() submitAttempt: boolean = false;

  @ViewChildren(DateTime) dateTimes: QueryList<DateTime>;

  theForm: FormGroup = null;

  displayForm: Form = <any>{};

  private sub: Subscription;

  private valueChangesSub: Subscription;

  selectionMode: boolean = false;

  data: any;

  barcodeStatusMap = {
    undefined: "",
    null: "",
    0 : "",
    1 : "",
    2 : "queued"
  };

  constructor(private fb: FormBuilder, private zone: NgZone, private modal: ModalController) {
    this.theForm = new FormGroup({});
  }

  showSelection(){
    let modal = this.modal.create(OcrSelector, {imageInfo:"", form: this.form, submission: this.submission});
    modal.present();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
      this.dateTimes.changes.subscribe((dateTime) => {
        this.dateTimes.forEach((dt) => {
          dt.setValue(localISOTime);
        })
      });
    });
  }

  public hasChanges(): boolean {
    return this.theForm.dirty;
  }

  public getFormGroup() {
    return this.theForm;
  }

  public getError(): String {
    return this.composeErrorMessage();
  }

  public getValues(): { [key: string]: string } {
    var data = {};
    let parse = (form: FormGroup, data: any) => {
      for (let id in form.controls) {
        let control = form.controls[id];
        if (control instanceof FormGroup) {
          parse(control, data);
        } else{
          data[id] = control.value;
        }
      }
    };
    this.theForm && parse(this.theForm, data);
    return data;
  }

  public clear() {
    this.theForm.reset();
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['form'] || changes['submission']) {
      if (this.form && this.submission) {
        setTimeout(()=> {
          this.setupFormGroup();
        }, 1);
      }
    } else if (changes['prospect'] && this.prospect) {
      let keys = Object.keys(this.prospect.fields);
      for (let i = 0; i < keys.length; i ++) {
        let key = keys[i];
        let element = this.getElementForProspectItemId(key);
        if (element) {
          let value = this.prospect.fields[key];
          if (value) {
            element.setValue(value);
          }
        }
      }
    }
  }

  getElementForProspectItemId(identifier) {
    let el;
    for (let i = 0; i < this.form.elements.length; i++) {
      let element = this.form.elements[i];
      let id = "element_" + element.id;
      let hasSubelements = element["sub_elements"].length > 0;

      for (let j = 0; j < element.mapping.length; j++) {
        let subelement = element.mapping[j];
        if (subelement["ll_field_unique_identifier"] == identifier) {
          el = this.theForm.get(id);
          if (hasSubelements) {
            let subId = id + "_" + (j + 1);

            el = this.theForm.get(id).get(subId);
          }
          return el;
        }
      }
    }
    return el;
  }

  private setupFormGroup() {

    if (this.sub) {
      this.sub.unsubscribe();
    }

    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }

    this.data = this.getValues();

    if (this.submission && this.submission.fields) {
      this.data = Object.assign(Object.assign({}, this.submission.fields), this.data);
    }
    let f = this.fb.group({});

    this.form.elements.forEach((element) => {
      let identifier = this.elementIdentifier(element);
      let control = this.createFormControl(element, identifier);
      element.placeholder = element.placeholder ? element.placeholder : "";
      f.addControl(identifier, control);
    });

    this.theForm = f;

    this.updateForm();

    //console.log(this.form, f);
    this.sub = this.theForm.statusChanges.subscribe(() => {
      this.onValidationChange.emit(this.theForm.valid);
    });

    this.valueChangesSub = this.theForm.valueChanges.subscribe((data) => {
      this.updateForm();

    });

    setTimeout(() => {
      this.zone.run(() => {
        this.displayForm = this.form;
        this.displayForm.elements = [
          ...this.displayForm.elements,
          {
            ...this.displayForm.elements[0],
            id: 999,
            type: 'document',
            title: 'ELM Documents'
          },
          {
            ...this.displayForm.elements[0],
            id: 9999,
            type: 'document',
            title: 'POST SHOW Docs'
          }
        ];
        console.log(this.displayForm);
      });
    }, 150);
  }

  private createFormControl(element, identifier: string) {
    element["identifier"] = identifier;
    let control: AbstractControl = null;
    if (element.mapping.length > 1) {
      var opts = {};
      //For sub elements we have standalone is_required property, so we use this one in the validator
      element.mapping.forEach((entry, index) => {
        entry["identifier"] = identifier + "_" + (index + 1);
        opts[entry["identifier"]] = new FormControl({
          value: this.data[entry["identifier"]] ? this.data[entry["identifier"]] : this.getDefaultValue(element),
          disabled: element.is_readonly || this.readOnly
        }, this.makeValidators(element['sub_elements'][index]));
      });
      control = this.fb.group(opts);
    } else {
      control = this.fb.control({
        value: this.data[identifier] || this.getDefaultValue(element),
        disabled: element.is_readonly || this.readOnly
      });
      control.setValidators(this.makeValidators(element));
    }
    return control;
  }

  private getDefaultValue(element: FormElement): any{
    switch(element.type){
      case FormElementType.checkbox:
        let data = [];
        element.options.forEach((opt) => {
          if(opt.is_default == 1){
            data.push(opt.option);
          }
        });
        return data;
      case FormElementType.select:
      case FormElementType.radio:
        let d = "";
        element.options.forEach((opt) => {
          if(opt.is_default == 1){
            d = opt.option;
          }
        });
        return d;

    }
    return element.default_value;
  }

  private makeValidators(element: FormElement): any[] {
    var validators = [];
    if (element.is_required) {
      validators.push(Validators.required);
    }
    switch (element.type) {
      case "email":
        validators.push(this.wrapValidator(this.form, element, this.submission, CustomValidators.email));
        break;
      case "url":
        validators.push(this.wrapValidator(this.form, element, this.submission, CustomValidators.url));
        break;
      case "text":
        validators.push(this.wrapValidator(this.form, element, this.submission, Validators.maxLength(255)));
        break;
      case "phone":
        validators.push(this.wrapValidator(this.form, element, this.submission, CustomValidators.phone()));
        break;
    }
    return validators;
  }

  onInputChange() {

  }

  //MARK: Private

  private composeErrorMessage() {
    let invalidControls = [];
    for (let key in this.theForm.controls) {
      if (this.theForm.controls[key].invalid) {
        let controlId = key.split('_')[1];
        invalidControls.push(this.getNameForElementWithId(controlId));
      }
    }
    return invalidControls.length > 0 ? ("Please check the following fields: " + invalidControls.join(', ')) : "";
  }

  private getNameForElementWithId(id) {
    for (let i = 0; i < this.displayForm.elements.length; i++) {
      let element = this.displayForm.elements[i];
      if (element.id == id) {
        return element.title;
      }
    }
  }

  private wrapValidator(form: Form, element: FormElement, submission: FormSubmission, validator: ValidatorFn) : ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} => {
      if(form.barcode_processed == BarcodeStatus.Queued && element.is_filled_from_barcode){
        return null;
      }
      return validator(control);
    };
  }


  private updateForm() {
    this.form.elements.forEach((element) => {
      if (element["visible_conditions"]) {
        this.applyVisibilityRules(element);
      }
    });
  }

  private validateVisibleCondition(rule: { field_identifier: string, condition: string, value: any }) {

    let identifier = "element_" + rule.field_identifier;

    let ruleValue = rule.value;
    let elementValue = this.theForm && this.theForm.value[identifier];

    switch (rule.condition) {
      case "equals" : {
        return this.isValueEqual(ruleValue, elementValue);
      }
      case "not_equal" : {
        return !this.isValueEqual(ruleValue, elementValue);
      }
      case "has_value" : {
        return elementValue && elementValue.length > 0;
      }
      case "is_blank" : {
        return elementValue && elementValue.length == 0;
      }
      case "doesnot_contain" : {
        return elementValue && !this.isValueMatched(ruleValue, elementValue);
      }
      case "contains" : {
        return elementValue && this.isValueMatched(ruleValue, elementValue);
      }
    }
  }

  private isValueMatched(ruleValue: [any], value) {
    let isMatch = false;
    for (let i = 0; i < ruleValue.length; i++) {
      let v1 = ruleValue[i];
      isMatch = value.includes(v1);
      if (isMatch) {
        break;
      }
    }
    return isMatch;
  }

  private isValueEqual(ruleValue: [any], value) {
    let isEqual = false;

    if (!ruleValue) {
      return isEqual;
    }

    for (let i = 0; i < ruleValue.length; i++) {
      let v1 = ruleValue[i];
      isEqual = value == v1;
      if (isEqual) {
        break;
      }
    }
    return isEqual;
  }

  private applyVisibilityRules(element) {
    let isMatchingRules = true;

    for (let rule of element.visible_conditions) {
      let isValidCondition = this.validateVisibleCondition(rule);
      if (typeof rule.operator != "undefined" && rule.operator == "OR") {
        isMatchingRules = isValidCondition || isMatchingRules;
      } else {
        isMatchingRules = isValidCondition && isMatchingRules;
      }
    }

    element.isMatchingRules = isMatchingRules;

    if (!element.isMatchingRules && !element.is_filled_from_barcode && !element.is_filled_from_list) {
      this.resetField(element);
    }

  }

  private shouldElementBeDisplayed(element) {
    return element.isMatchingRules;
  }

  resetField(element) {
    let identifier = this.elementIdentifier(element);

    let control = this.theForm && this.theForm.controls[identifier];
    if (!control) {
      return;
    }

    let value = this.getDefaultValue(element);

    let formGroupElement = this.theForm.controls[identifier];
    let subElements = element["sub_elements"];

    if (subElements && subElements.length > 0) {
      subElements.forEach(subElement => {
        let subElementId = identifier + "_" + subElement.sub_element_id;
        let formGroupSubElement = formGroupElement["controls"][subElementId];
        this.resetFormGroupElement(formGroupSubElement, value);
        this.theForm.value[identifier][subElementId] = value;
      });
    } else {
      this.resetFormGroupElement(formGroupElement, value);
      this.theForm.value[identifier] = value;
      element.value = value;
    }
  }

  resetFormGroupElement(element, value) {
    element.patchValue(value, {
      onlySelf: true,
      emitEvent: false,
      emitModelToViewChange: false,
      emitViewToModelChange: false,
    });
  }

  private elementIdentifier(element) {
    return "element_" + element.id;
  }

  onProcessing(event) {
    this.onProcessingEvent.emit(event);
  }
}
