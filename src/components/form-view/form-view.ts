import { Util } from './../../util/util';
import { formViewService } from './form-view-service';
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
import { ModalController, Platform } from "ionic-angular";
import { Activation } from '../../model/activation';

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
  @Output() doSubmit = new EventEmitter();
  @Output() ButtonEvent = new EventEmitter();

  @Input() readOnly: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() submitAttempt: boolean = false;
  @Input() activation : boolean;

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
    0: "",
    1: "",
    2: "queued"
  };

  isSeparatable : boolean = false;
  separateAt: number;
  buttonBar : Subscription;
  elements : FormElement[][];

  constructor(
    private fb: FormBuilder,
    private zone: NgZone,
    private modal: ModalController,
    private util : Util,
    private platform : Platform,
    private formViewService:formViewService,
  ) {
    this.theForm = new FormGroup({});
    //this.documentsService.syncByForm(this.form.id);
  }

  showSelection() {
    let modal = this.modal.create(OcrSelector, { imageInfo: "", form: this.form, submission: this.submission });
    modal.present();
  }

  ngAfterViewInit() {
    console.log("Activation fron form-view",this.activation)
    setTimeout(() => {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
      this.dateTimes.changes.subscribe((dateTime) => {
        this.dateTimes.forEach((dt) => {
          dt.setValue(localISOTime);
        })
      });
    });
  }

  ionViewDidEnter(){
   this.buttonBar = this.formViewService.onButtonEmit.subscribe((data)=>{
     if(data == 'reset') this.clear();
   })
  }

  public hasChanges(): boolean {
    return this.theForm.dirty;
  }

  public getFormGroup() {
    return this.theForm;
  }

  public getError()  {
    return this.composeErrorMessage();
  }

  public getValues(): { [key: string]: string } {
    var data = {};
    let parse = (form: FormGroup, data: any) => {
      for (let id in form.controls) {
        let control = form.controls[id];
        if (control instanceof FormGroup) {
          parse(control, data);
        } else {
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
       this.setupFormGroup()
      }
    } else if (changes['prospect'] && this.prospect) {
      let keys = Object.keys(this.prospect.fields);
      for (let i = 0; i < keys.length; i++) {
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
    this.theForm = this.fb.group({});
    this.setElementsValidation()
    this.splitEls()
    this.updateForm();
    this.sub = this.theForm.statusChanges.subscribe(() => {
      this.onValidationChange.emit(this.theForm.valid);
    });
    this.valueChangesSub = this.theForm.valueChanges.subscribe((data) => {
      this.updateForm();

    });

    setTimeout(() => {
      this.zone.run(() => {
        this.displayForm = this.form;
        this.buildSections();
      });
    }, 150);
  }

  setElementsValidation(){
    this.form.elements.forEach((element,index) => {
      this.setElementValidator(element);
      this.checkSeparator(element,index);
    });
  }

  private setElementValidator(element:FormElement){
    let identifier = this.elementIdentifier(element);
    let control = this.createFormControl(element, identifier);
    element.placeholder = element.placeholder ? element.placeholder : "";
    this.theForm.addControl(identifier, control);
  }

  private checkSeparator(element,index){
    if(element.type == FormElementType.separator && (this.platform.is('tablet') || this.platform.is('ipad'))){
      this.isSeparatable = true;
      this.separateAt = index;
    }
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
        },  this.makeValidators(element['sub_elements'][index]));
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

  private getDefaultValue(element: FormElement): any {
    switch (element.type) {
      case FormElementType.checkbox:
        let data = [];
        element.options.forEach((opt) => {
          if (opt.is_default == 1) {
            data.push(opt.option);
          }
        });
        return data;
      case FormElementType.select:
      case FormElementType.radio:
        let d = "";
        element.options.forEach((opt) => {
          if (opt.is_default == 1) {
            d = opt.option;
          }
        });
        return d;

    }
    return element.default_value;
  }

  private makeValidators(element: FormElement): any[] {
		if(!element) return;  // A.S a bug here
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

  private composeErrorMessage() : {text : string,param:string} {
    let invalidControls = [];
    for (let key in this.theForm.controls) {
      if (this.theForm.controls[key].invalid) {
        let controlId = key.split('_')[1];
        invalidControls.push(this.getNameForElementWithId(controlId));
      }
    }
    return invalidControls.length > 0 ? {text:'form-capture.check-fields-msg',param : invalidControls.join(', ')} : {text:'',param:''};
  }

  private getNameForElementWithId(id) {
    for (let i = 0; i < this.displayForm.elements.length; i++) {
      let element = this.displayForm.elements[i];
      if (element.id == id) {
        return element.title;
      }
    }
  }

  private wrapValidator(form: Form, element: FormElement, submission: FormSubmission, validator: ValidatorFn): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (form.barcode_processed == BarcodeStatus.Queued && element.is_filled_from_barcode) {
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
      case "equals": {
        return this.isValueEqual(ruleValue, elementValue);
      }
      case "not_equal": {
        return !this.isValueEqual(ruleValue, elementValue);
      }
      case "has_value": {
        return elementValue && elementValue.length > 0;
      }
      case "is_blank": {
        return elementValue && elementValue.length == 0;
      }
      case "doesnot_contain": {
        return elementValue && !this.isValueMatched(ruleValue, elementValue);
      }
      case "contains": {
        return elementValue && this.isValueMatched(ruleValue, elementValue);
      }
    }
  }

   splitEls() {
     this.form.elements = this.util.sortBy(this.form.elements,1,'position');
     if(this.isSeparatable) this.elements = [
      this.form.elements.slice(0,this.separateAt),
      this.form.elements.slice(this.separateAt+1)
     ]
    else this.elements = [this.form.elements]
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

   shouldElementBeDisplayed(element: FormElement) {
    if(this.activation){
      return element.isMatchingRules && !element.parent_element_id && element.available_in_activations;
    }
    else{
    return element.isMatchingRules && !element.parent_element_id;
  }
  }

   shouldElementBeDisplayedInsideSection(element: FormElement) {
    if(this.activation){
      return element.isMatchingRules && element.available_in_activations;
    }
    else{
    return element.isMatchingRules;
    }
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
  
  canSubmitForm(event){
    this.doSubmit.emit(event);
    console.log("Form view",JSON.parse(event))
  }

  onButtonEvent(event){
    this.ButtonEvent.emit(event);
  }

  private buildSections() {
    const sections = {};

    const findSectionChildElements = (sectionId) => {
      return this.displayForm.elements.filter((d) => d.parent_element_id == sectionId);
    };

    this.displayForm.elements
      .filter((d) => d.type == 'section_block')
      .forEach((section) => {
        section.children = findSectionChildElements(section.id);
        sections[section.id] = section;
      });

    Object.keys(sections).forEach((key: any) => {
      const dataIndex = this.displayForm.elements.findIndex((d) => d.id == key);
      this.displayForm[dataIndex] = sections[key];
    })
  }

  show(el){
    // console.log(el);
  }

  // used by the *ngFor
   trackByFn(index: number, item: FormElement) {
    if (!item) {
      return null;
    }

    return item.id;
  }
}
