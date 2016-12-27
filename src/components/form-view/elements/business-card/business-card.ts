import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Camera, File } from "ionic-native";
declare var cordova: any;

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

	front: string = "assets/images/business-card-front.svg";
	back: string = "assets/images/business-card-back.svg";

	FRONT: number = 0;
	BACK: number = 1;

	constructor() {
		super();
		this.currentValue = {
			front: this.front,
			back: this.back
		};
	}

	captureImage(type: number){
		Camera.getPicture({
			sourceType: 1
		}).then(imageData => {
			this.moveFile(imageData, cordova.file.dataDirectory + "leadliaison/images").subscribe((newPath) => {
				if(type == this.FRONT){
					this.currentValue.front = newPath;
				}else{
					this.currentValue.back = newPath;
				}
				var v = {
					front: null,
					back: null
				};
				if(this.currentValue.front && this.currentValue.front != this.front){
					v.front = this.currentValue.front;
				}
				if(this.currentValue.back && this.currentValue.back != this.back){
					v.back = this.currentValue.back;
				}
				this.propagateChange(v);
			})
		}).catch(err => {

		});
	}

	writeValue(obj: any):void{
		if(!obj){
			this.currentValue = {
				front: this.front,
				back: this.back
			};
		}else{
			this.currentValue = obj;
			if(!this.currentValue.front){
				this.currentValue.front = this.front;
			}
			if(!this.currentValue.back){
				this.currentValue.back = this.back;
			}
		}
	}
}