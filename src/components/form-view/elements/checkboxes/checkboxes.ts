import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: 'checkboxes',
	templateUrl: 'checkboxes.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Checkboxes), multi: true }
	]
})
export class Checkboxes extends BaseElement {
	@Input() element: FormElement;
	@Input() formGroup: FormGroup;

	constructor() {
		super();
	}

	writeValue(obj: any): void{
		this.currentValue = obj;
		if(!obj){
			this.currentValue = [];
		}
	}

	onCheckChange(event, option){
		console.log(event);
		if(event.checked){
			this.currentValue.push(option.option);
		}else{
			let idx = this.currentValue.indexOf(option.option);
			if(idx > -1){
				this.currentValue.splice(idx, 1);
			}
		}
		this.propagateChange(this.currentValue);
	}

	has(values: any[], option){
		return values && values.filter((val)=>{
			return val == option.option;
		}).length > 0;
	}
}