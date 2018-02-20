import { Component, NgZone, Input, SimpleChange, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission, FormElementType, ElementMapping } from "../../model";

import { FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from '../../util/validator';
import { Subscription } from "rxjs/Subscription";

@Component({
	selector: 'selection-view',
	templateUrl: 'selection-view.html'
})
export class FormSelectionView {

	@Input() form: Form;
	@Input() submission: FormSubmission;
	@Output() select: EventEmitter<string>;
	@Output() inputChange: EventEmitter<any>;
	@Input() outsideChanged: any;

	inputsDisabled: any;

	theForm: FormGroup;

	displayForm: Form = <any>{};

	selectionMode: boolean = true;

	private sub: Subscription;

	data: any;

	constructor(private fb: FormBuilder, private zone: NgZone) {
		this.theForm = fb.group({});
		this.select = new EventEmitter<string>();
		this.inputChange = new EventEmitter();
	}

	public hasChanges(): boolean {
		return this.theForm.dirty;
	}

	ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
		if (changes['form'] || changes['submission']) {
			if (this.form && this.submission) {
				this.setupFormGroup();				
			} else {
				this.theForm = new FormGroup({});
				this.displayForm = <any>{};
			}
		}else if(changes['outsideChanged']){
			for(let identifier in this.outsideChanged){
				let match = /(\w+\_\d+)\_\d+/g.exec(identifier);
				let ctrl: AbstractControl = null;
				if(match && match.length > 0){
					ctrl = this.theForm.get(match[1]).get(identifier);
				}else{
					ctrl = this.theForm.get(identifier);
				}
				ctrl.setValue(this.outsideChanged[identifier]);
				let t = {};
				t[identifier] = false;
				this.inputsDisabled = Object.assign({}, this.inputsDisabled, t);
				ctrl.markAsTouched();
				ctrl.enable();
				ctrl.markAsDirty();
			}
		}
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

	public selectEntry(identifier: string){
		this.select.emit(identifier);
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
			var identifier = element["identifier"];
			var control: AbstractControl = null;
			if (element.mapping.length > 1) {
				var opts = {};
				element.mapping.forEach((entry, index) => {
					opts[entry["identifier"]] = new FormControl({ value: this.data[entry["identifier"]] ? this.data[entry["identifier"]] : this.getDefaultValue(element), disabled: true }, this.makeValidators(element));
				})
				control = this.fb.group(opts);
			} else {
				control = this.fb.control({ value: this.data[identifier] || this.getDefaultValue(element), disabled: true });
				control.setValidators(this.makeValidators(element));
			}
			f.addControl(identifier, control);
		});
		this.theForm = f;
		this.sub = f.valueChanges.subscribe((data) => {
			this.inputChange.emit(data);
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
				validators.push(CustomValidators.email);
				break;
			case "url":
				validators.push(CustomValidators.url);
				break;
			case "text":
				validators.push(Validators.maxLength(255));
				break;				
			case "phone":
				validators.push(CustomValidators.phone());
				break;
		}
		return validators;
	}
}