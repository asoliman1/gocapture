import { Component, NgZone, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../model";
import { FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
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
	@Output() onChange = new EventEmitter<any>();
	@Output() onValidationChange = new EventEmitter<any>();

	theForm : FormGroup = null;

	displayForm: Form = <any>{};

	private sub: Subscription;

	constructor(private fb: FormBuilder, private zone: NgZone) {

	}

	public getValues(): {[key: string]: string}{
		var data = {};
		let parse = (form: FormGroup, data: any) => {
			for(let id in form.controls){
				let control = form.controls[id];
				if(control instanceof FormGroup){
					parse(control, data);
				}else{
					data[id] = control.value;
				}
			}
		};
		this.theForm && parse(this.theForm, data);
		return data;
	}

	ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
		if (changes['form']){
			if(this.form) {
				this.setupFormGroup();
			}else{
				this.theForm = new FormGroup({});
				this.displayForm = <any>{};
			}
		}else if (changes['prospect']&& this.prospect){
			var foundEmail, foundName;
			for(let i = 0; i < this.form.elements.length; i++){
				if(this.form.elements[i].type == "email" && !foundEmail){
					this.theForm.get("element_" + this.form.elements[i].id).setValue(this.prospect.fields["Email"]);
					foundEmail = true;
				}else if(this.form.elements[i].type == "simple_name" && !foundName){
					var id = "element_" + this.form.elements[i].id;
					this.theForm.get(id).get(id + "_1").setValue(this.prospect.fields["FirstName"]);
					this.theForm.get(id).get(id + "_2").setValue(this.prospect.fields["LastName"]);
					foundName = true;
				}
			}
		}
	}

	private setupFormGroup(){
		if(this.sub){
			this.sub.unsubscribe();
		}
		let data = this.getValues();
		if(this.submission && this.submission.fields){
			data = Object.assign(Object.assign({}, this.submission.fields), data);
		}
		let theForm = this.fb.group({});
		this.form.elements.forEach((element)=>{
			var identifier = "element_" + element.id;
			element["identifier"] = identifier;
			var control : AbstractControl = null;
			if(element.mapping.length > 1){
				var opts = {};
				element.mapping.forEach((entry, index) =>{
					entry["identifier"] = identifier + "_" + (index+1);
					opts[entry["identifier"]] = new FormControl(data[entry["identifier"]] ? data[entry["identifier"]] : element.default_value, this.makeValidators(element));
				})
				control = this.fb.group(opts);
			}else{
				control = this.fb.control({value : data[identifier] || element.default_value, disabled: element.is_readonly});
				control.setValidators(this.makeValidators(element));
			}
			theForm.addControl(identifier, control);
			/*switch(element.type){
				case "simple_name":
					break;
				case "email":
					break;
				case "url":
					break;
				case "text":
					break;
				case "select":
					break;
				case "radio":
					break;
			}*/
		});
		this.theForm = theForm;
		this.sub = this.theForm.statusChanges.subscribe(()=>{
			this.onValidationChange.emit(this.theForm.valid);
		});
		setTimeout(()=>{
			this.zone.run(()=>{
				this.displayForm = this.form;
			});
		}, 150);
	}

	private makeValidators(element: FormElement) : any[]{
		var validators = [];
		if(element.is_required){
			validators.push(Validators.required);
		}
		switch(element.type){
			case "email":
				validators.push(CustomValidators.email);
				break;
			case "url":
				validators.push(CustomValidators.url);
				break;
		}
		return validators;
	}

	onInputChange(){

	}
}