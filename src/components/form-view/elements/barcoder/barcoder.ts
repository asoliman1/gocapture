import { RESTClient } from '../../../../services/rest-client';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component, Input, forwardRef } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../../../model";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, AbstractControl } from "@angular/forms";
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
	@Input() form: Form;	
	@Input() readonly: boolean = false;

	constructor(private barcodeScanner: BarcodeScanner, private client: RESTClient) {
		super();
	}

	ngOnInit(){
		
	}

	scan(){
		this.barcodeScanner.scan().then((scannedData) => {
			this.writeValue(scannedData.text);
			this.client.fetchBarcodeData(scannedData.text, this.element.barcode_provider_id).subscribe( data => {
				if(!data || data.length == 0){
					return;
				}
				var vals = {};
				for(let id in this.formGroup.controls){
					if(this.formGroup.controls[id]["controls"]){
						vals[id] = {};
						for(let subid in this.formGroup.controls[id]["controls"]){
							vals[id][subid] = this.formGroup.controls[id]["controls"][subid].value;
						}
					}else{
						vals[id] = this.formGroup.controls[id].value;
					}
				}
				data.forEach(entry => {
					let id = this.form.getIdByUniqueFieldName(entry.ll_field_unique_identifier);
					if(!id){
						return;
					}
					let match = /(\w+\_\d+)\_\d+/g.exec(id);
					let ctrl: AbstractControl = null;
					if(match && match.length > 0){
						if(!vals[match[1]]){
							vals[match[1]] = {};
						}
						vals[match[1]][id] = entry.value;
						ctrl = this.formGroup.get(match[1]).get(id);
						ctrl.markAsTouched();
						ctrl.markAsDirty();
					}else{
						vals[id] = entry.value;
						ctrl = this.formGroup.get(id);
						ctrl.markAsTouched();
						ctrl.markAsDirty();
					}
				});
				this.formGroup.setValue(vals);
			});
		}).catch(err => {

		});
	}

}