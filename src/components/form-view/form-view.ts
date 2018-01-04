import { OcrSelector } from '../ocr-selector/index';
import { Component, NgZone, Input, SimpleChange, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Form, BarcodeStatus, FormElement, DeviceFormMembership, FormSubmission, FormElementType, ElementMapping } from "../../model";
import { DateTime, ModalController } from "ionic-angular";
import { ValidatorFn, FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from '../../util/validator';
import { Subscription } from "rxjs";

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

	@Input() readOnly: boolean = false;

	@ViewChildren(DateTime) dateTimes: QueryList<DateTime>;

	theForm: FormGroup = null;

	displayForm: Form = <any>{};

	private sub: Subscription;

	selectionMode: boolean = false;

	data: any;

	barcodeStatusMap = {
		undefined: "",
		null: "",
		0 : "",
		1 : "",
		2 : "queued"
	}

	constructor(private fb: FormBuilder, private zone: NgZone, private modalCtrl: ModalController) {
	}

	showSelection(){
		let modal = this.modalCtrl.create(OcrSelector, {imageInfo:"", form: this.form, submission: this.submission});
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

	ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
		if (changes['form'] || changes['submission']) {
			if (this.form && this.submission) {
				this.readOnly = this.submission.isSubmitted();
				setTimeout(()=> {
					this.setupFormGroup();
				}, 1);				
			} else {
				this.theForm = new FormGroup({});
				this.displayForm = <any>{};
			}
		} else if (changes['prospect'] && this.prospect) {
			var foundEmail, foundName;
			for (let i = 0; i < this.form.elements.length; i++) {
				if (this.form.elements[i].type == "email" && !foundEmail) {
					this.theForm.get("element_" + this.form.elements[i].id).setValue(this.prospect.fields["Email"]);
					foundEmail = true;
				} else if (this.form.elements[i].type == "simple_name" && !foundName) {
					var id = "element_" + this.form.elements[i].id;
					this.theForm.get(id).get(id + "_1").setValue(this.prospect.fields["FirstName"]);
					this.theForm.get(id).get(id + "_2").setValue(this.prospect.fields["LastName"]);
					foundName = true;
				}
			}
		}
	}
	
	private setupFormGroup() {
		if (this.sub) {
			this.sub.unsubscribe();
		}
		this.data = this.getValues();
		if (this.submission && this.submission.fields) {
			this.data = Object.assign(Object.assign({}, this.submission.fields), this.data);
		}
		let f = this.fb.group({});
		this.form.elements.forEach((element) => {
			var identifier = "element_" + element.id;
			element["identifier"] = identifier;
			var control: AbstractControl = null;
			if (element.mapping.length > 1) {
				var opts = {};
				element.mapping.forEach((entry, index) => {
					entry["identifier"] = identifier + "_" + (index + 1);
					opts[entry["identifier"]] = new FormControl({ value: this.data[entry["identifier"]] ? this.data[entry["identifier"]] : this.getDefaultValue(element), disabled: element.is_readonly || this.readOnly }, this.makeValidators(element));
				})
				control = this.fb.group(opts);
			} else {
				control = this.fb.control({ value: this.data[identifier] || this.getDefaultValue(element), disabled: element.is_readonly || this.readOnly });
				control.setValidators(this.makeValidators(element));
			}
			f.addControl(identifier, control);
		});
		this.theForm = f;
		//console.log(this.form, f);
		this.sub = this.theForm.statusChanges.subscribe(() => {
			this.onValidationChange.emit(this.theForm.valid);
		});
		setTimeout(() => {
			this.zone.run(() => {
				this.displayForm = this.form;
			});
		}, 150);
	}

	private getDefaultValue(element: FormElement): any{
		switch(element.type){
			case FormElementType.checkbox:
				let data = [];
				element.options.forEach((opt) => {
					if(opt.is_default == "1"){
						data.push(opt.option);
					}
				});
				return data;
			case FormElementType.select:
			case FormElementType.radio:
				let d = "";
				element.options.forEach((opt) => {
					if(opt.is_default == "1"){
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

	setHour(event) {

	}

	setDate(event) {
		//console.log(event);
	}

	private wrapValidator(form: Form, element: FormElement, submission: FormSubmission, validator: ValidatorFn) : ValidatorFn{
		return (control: AbstractControl): {[key: string]: any} => {
			if(form.barcode_processed == BarcodeStatus.Queued && element.is_filled_from_barcode){
				return null;
			}
			return validator(control);
		};
	}
}