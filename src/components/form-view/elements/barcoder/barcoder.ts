import { RESTClient } from '../../../../services/rest-client';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ToastController } from "ionic-angular";
import { Component, Input, forwardRef } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission, BarcodeStatus } from "../../../../model";
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, AbstractControl, FormControl } from "@angular/forms";
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
	@Input() submission: FormSubmission;
	@Input() readonly: boolean = false;

	statusMessage: string = "Scan bar code";

	constructor(private barcodeScanner: BarcodeScanner, private client: RESTClient, private toast: ToastController) {
		super();
	}

	ngOnInit(){
		
	}

	scan(){
		this.form["barcode_processed"] = BarcodeStatus.Queued;
		this.submission && (this.submission.barcode_processed = BarcodeStatus.Queued);
		this.statusMessage = "Scanning...";
		this.barcodeScanner.scan().then((scannedData) => {
			this.writeValue(scannedData.text);
			this.toast.create({
				message: "Barcode scanned successfully",
				duration: 5000,
				position: "top",
				cssClass: "success"
			}).present();
			this.statusMessage = "Processing...";
			this.client.fetchBarcodeData(scannedData.text, this.element.barcode_provider_id).subscribe( data => {
				this.statusMessage = "Scan another barcode";
				if(!data || data.length == 0){
					return;
				}
				this.submission && (this.submission.barcode_processed = BarcodeStatus.Processed);
				this.form["barcode_processed"] = BarcodeStatus.Processed;
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
				
			}, err => {
				this.statusMessage = "Scan another barcode";
				this.form.elements.forEach((element) => {
					if(element.is_filled_from_barcode){
						let control = this.getControl(this.formGroup, element["identifier"]);
						if(control){
							control.setValue("Scanned");
						}
					}
				});
			});
		}).catch(err => {
			this.statusMessage = "Could not scan barcode";
			this.submission && (this.submission.barcode_processed = BarcodeStatus.None);
			this.form["barcode_processed"] = BarcodeStatus.None;
		});
	}

	private getControl(formGroup: FormGroup, id: string): FormControl{
		let control = null;
		if(id){
			let match = /(\w+\_\d+)\_\d+/g.exec(id);
			if(match && match.length > 0){
				control = <FormControl>this.formGroup.get(match[1]).get(id);
			}else{
				control = <FormControl>this.formGroup.get(id);
			}
		}
		return control;
	}

}