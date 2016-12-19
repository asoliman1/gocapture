import { Component, NgZone, Input, SimpleChange, Output, EventEmitter, forwardRef } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../../../model";
import { Subscription } from "rxjs";
import { SignatureModal} from "./signature.modal";
import { ModalController} from "ionic-angular"
import { BaseElement } from "../base-element";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: 'signature',
	templateUrl: 'signature.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Signature), multi: true }
	]
})
export class Signature extends BaseElement{

	@Input() element: FormElement;
	@Input() formGroup: FormGroup;

	constructor(private modalCtrl: ModalController) {
		super();
	}

	show(){
		let modal = this.modalCtrl.create(SignatureModal);
		modal.onDidDismiss((sigStr) => {
			if(sigStr){
				this.onChange(sigStr);
			}
		});
		modal.present();
	}
}