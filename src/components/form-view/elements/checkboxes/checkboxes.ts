import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement, Form } from "../../../../model";
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
	@Input() form: Form;
	@Input() readonly: boolean = false;

	constructor() {
		super();
	}
	
	ngOnInit() {}

	writeValue(obj: any): void {
		if(!obj){
			obj = [];
			for(let i = 0; i < this.element.options.length; i++){
				if(this.element.options[i].is_default == 1){
					obj.push(this.element.options[i].option);
				}
			}
		}

    if (typeof obj === 'string') {
      obj = obj.split(';');
    }

		this.currentVal = obj;
	}


	onCheckChange(event, option){
		//console.log(event);
		if(event.checked){
			this.currentVal.push(option.option);
		}else{
			let idx = this.currentVal.indexOf(option.option);
			if(idx > -1){
				this.currentVal.splice(idx, 1);
			}
		}
		this.propagateChange(this.currentVal);
	}

	has(values: any[], option) {

		return values && values.filter((val)=>{
			return val == option.option;
		}).length > 0;
	}


	isElementItalicize() : string{
		return this.element.style.italicize ? 'italic' :'';
	}

	isLabelFullWidth() : string{
		return this.element.style.full_width_text ? 'max-content' : '';
	}

	getAlignment(){
		switch (this.element.style.vertical_alignment) {
			case "top":
				return "flex-start"
			case "middle":
				return "center"
			case "bottom":
				return "flex-end"

			default :
			return "top";
		}
	}
}
