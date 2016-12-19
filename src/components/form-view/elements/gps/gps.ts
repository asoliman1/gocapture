import { Component, NgZone, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../../../model";
import { FormBuilder, AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Geolocation } from "ionic-native";

@Component({
	selector: 'gps',
	templateUrl: 'gps.html'
})
export class Gps {

	@Input() form: Form;
	@Input() submission: FormSubmission;
	@Input() prospect: DeviceFormMembership;
	@Output() onChange = new EventEmitter<any>();
	@Output() onValidationChange = new EventEmitter<any>();

	theForm : FormGroup = new FormGroup({});

	displayForm: Form = <any>{};
	loading: boolean = true;
	latitude: string;
	longitude: string;

	constructor(private fb: FormBuilder, private zone: NgZone) {

	}

	ngOnInit(){
		this.refresh();
	}

	refresh(){
		this.loading = true;
		Geolocation.getCurrentPosition()
		.then(pos => {
			this.latitude = pos.coords.latitude + "";
			this.longitude = pos.coords.longitude + "";
			this.loading = false;
		}).catch( err => {
			this.loading = false;
		})
	}

}