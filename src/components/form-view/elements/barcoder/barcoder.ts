import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component, Input, forwardRef } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../../../model";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseElement } from "../base-element";

@Component({
	selector: 'barcoder',
	templateUrl: 'barcoder.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Barcoder), multi: true }
	]
})
export class Barcoder extends BaseElement {
	
	@Input() element: FormElement;
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;

	constructor(private barcodeScanner: BarcodeScanner) {
		super();
	}

	ngOnInit(){
		
	}

	scan(){
		this.barcodeScanner.scan().then((scannedData) => {

		}).catch(err => {

		});
	}

}