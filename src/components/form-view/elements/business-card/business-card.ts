import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Camera } from "ionic-native";

@Component({
	selector: 'business-card',
	templateUrl: 'business-card.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => BusinessCard), multi: true }
	]
})
export class BusinessCard extends BaseElement {

	@Input() element: FormElement;
	@Input() formGroup: FormGroup;

	front: string;
	back: string;

	FRONT: number = 0;
	BACK: number = 1;

	constructor() {
		super();
	}
	captureImage(type: number){
		Camera.getPicture({
			sourceType: 1,
			destinationType: 0
		}).then(imageData => {

		}).catch(err => {

		});
	}
}