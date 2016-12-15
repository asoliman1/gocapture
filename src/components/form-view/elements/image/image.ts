import { Component, NgZone, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../../../model";
import { FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
	selector: 'image',
	templateUrl: 'image.html'
})
export class Image {

	@Input() form: Form;
	@Input() submission: FormSubmission;
	@Input() prospect: DeviceFormMembership;
	@Output() onChange = new EventEmitter<any>();
	@Output() onValidationChange = new EventEmitter<any>();

	theForm : FormGroup = new FormGroup({});

	displayForm: Form = <any>{};

	constructor(private fb: FormBuilder, private zone: NgZone) {

	}
}