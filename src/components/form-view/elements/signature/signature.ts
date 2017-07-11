import { Component, Input, forwardRef } from '@angular/core';
import { FormElement } from "../../../../model";
import { SignatureModal} from "./signature.modal";
import { ModalController} from "ionic-angular"
import { BaseElement } from "../base-element";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
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

	constructor(private modalCtrl: ModalController, private screen: ScreenOrientation) {
		super();
	}

	show(){
		if(this.readonly){
			return;
		}
		let modal = this.modalCtrl.create(SignatureModal);
		modal.onDidDismiss((sigStr) => {
			this.screen.unlock();
			if(sigStr){
				this.onChange(sigStr);
			}
		});
		modal.present();
		this.screen.lock(this.screen.ORIENTATIONS.LANDSCAPE);
	}
}