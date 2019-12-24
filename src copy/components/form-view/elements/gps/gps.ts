import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Form, DeviceFormMembership, FormSubmission } from "../../../../model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation";

@Component({
	selector: 'gps',
	templateUrl: 'gps.html'
})
export class Gps {

	@Input() form: Form;
	@Input() submission: FormSubmission;
	@Input() prospect: DeviceFormMembership;
	@Output() onChange = new EventEmitter();
	@Output() onValidationChange = new EventEmitter();
	@Input() readonly: boolean = false;

	theForm : FormGroup = new FormGroup({});

	displayForm: Form = <any>{};
	loading: boolean = true;
	latitude: string;
	longitude: string;

	constructor(private fb: FormBuilder, private geolocation: Geolocation) {

	}

	ngOnInit(){
		this.refresh();
	}

	refresh(){
		this.loading = true;
		this.geolocation.getCurrentPosition()
		.then(pos => {
			this.latitude = pos.coords.latitude + "";
			this.longitude = pos.coords.longitude + "";
			this.loading = false;
		}).catch( err => {
			this.loading = false;
		})
	}

}