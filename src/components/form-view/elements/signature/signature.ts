import { Component, Input, forwardRef } from '@angular/core';
import { Form, FormElement } from "../../../../model";
import { SignatureModal} from "./signature.modal";
import { ModalController} from "ionic-angular"
import { BaseElement } from "../base-element";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
declare var screen;

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
	@Input() readonly: boolean = false;

	constructor(private modalCtrl: ModalController) {
		super();
	}

	show(){
		if(this.readonly){
			return;
		}
		let modal = this.modalCtrl.create(SignatureModal);
		modal.onDidDismiss((sigStr) => {
			screen.orientation.unlock && screen.orientation.unlock();
			if(sigStr){
				this.onChange(sigStr);
			}
		});
		modal.present();
		screen.orientation.lock && screen.orientation.lock('landscape');
	}
}