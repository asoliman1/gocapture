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
	ngOnInit() {
		this.setStyle()
	  }
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

	setStyle(){
		if(this.element.style.text_color){
			document.documentElement.style.setProperty(`--label_color`, this.element.style.text_color);
		}
		else{
			document.documentElement.style.setProperty(`--label_color`, this.form.event_style.elements_label_color);
		}
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

	isElementUnderlined() : boolean{
		return this.element.style.underline;
	}

	isElementItalicize() : boolean{
		return this.element.style.italicize;
	}

	isLabelFullWidth() : boolean{
		return this.element.style.full_width_text;
	}

	isAlignmentTop() :boolean{
		return this.element.style.vertical_alignment == "top" ? true: false;
	}
	isAlignmentMiddle() :boolean{
		return this.element.style.vertical_alignment == "middle" ? true: false;
	}
	isAlignmentBottom() :boolean{
		return this.element.style.vertical_alignment == "bottom" ? true: false;
	}
}
