import { Component, NgZone, Input, SimpleChange, Output, EventEmitter, forwardRef } from '@angular/core';
import { Form, FormElement, DeviceFormMembership, FormSubmission } from "../../../../model";
import { FormBuilder, AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription } from "rxjs";
import { BaseElement } from "../base-element";
import { ActionSheetController } from "ionic-angular";
import { Camera, ImagePicker } from 'ionic-native';

@Component({
	selector: 'image',
	templateUrl: 'image.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Image), multi: true }
	]
})
export class Image extends BaseElement {
	@Input() element: FormElement;
	@Input() formGroup: FormGroup;

	constructor(private fb: FormBuilder,
				private zone: NgZone,
				private actionCtrl: ActionSheetController) {
		super();
	}

	chooseType() {
		let sheet = this.actionCtrl.create({
			title: "",
			buttons: [
				{
					text: 'Use Camera',
					handler: () => {
						Camera.getPicture({
							sourceType: 1,
							destinationType: 0
						}).then(imageData => {

						}).catch(err => {

						});
					}
				},
				{
					text: 'Choose from Album',
					handler: () => {
						Camera.getPicture({
							sourceType: 0,
							destinationType: 0
						}).then(imageData => {

						}).catch(err => {

						});
					}
				},
				{
					text: 'Cancel',
					role: 'cancel'
				}
			]
		});
		sheet.present();
	}
}