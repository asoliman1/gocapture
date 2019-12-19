import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: 'radios',
	templateUrl: 'radios.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Radios), multi: true }
	]
})
export class Radios extends BaseElement {
	@Input() element: FormElement;
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;

	constructor() {
		super();
	}

	writeValue(obj: any): void{
		if(isNaN(parseInt(obj))) {
			for(let i = 0; i < this.element.options.length; i++) {
				if(this.element.options[i].is_default == 1) {
					obj = this.element.options[i].option;
					break;
				}
			}
		} else if( this.element.options.filter((entry)=>{
			return entry.option == obj;
		}).length == 0) {
		  if (obj) {
        obj = this.element.options[parseInt(obj)-1].option;
      }
		}
		super.writeValue(obj);
	}
}
