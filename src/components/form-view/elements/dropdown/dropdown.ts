import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
	selector: 'dropdown',
	templateUrl: 'dropdown.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Dropdown), multi: true }
	]
})
export class Dropdown extends BaseElement {
	@Input() element: FormElement = <any>{};
	@Input() formGroup: FormGroup;

	constructor() {
		super();
	}

	writeValue(obj: any): void{
		if(!obj){
			for(let i = 0; i < this.element.options.length; i++){
				if(this.element.options[i].is_default == 1){
					obj = this.element.options[i].option;
					break;
				}
			}
		}else if(this.element && this.element.options.filter((entry)=>{
			return entry.option == obj;
		}).length == 0){
			obj = this.element.options[parseInt(obj)-1].option;
		}
		super.writeValue(obj);
	}
}