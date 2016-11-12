import { Component, ViewChild, NgZone, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { Form } from "../../model";

@Component({
	selector: 'form-capture',
	templateUrl: 'form-view.html'
})
export class FormView {

	@Input() form: Form = new Form();
	@Output() onChange = new EventEmitter<any>();

	constructor() {

	}

	ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
		if (changes['form']) { // fire your event

		}
	}

	onInputChange(){

	}
}