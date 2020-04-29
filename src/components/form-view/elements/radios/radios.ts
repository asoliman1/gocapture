import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement, Form } from "../../../../model";
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
	@Input() form: Form;
	@Input() readonly: boolean = false;

	constructor() {
		super();
	}

	ngOnInit() {
		this.setStyle()
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

	setStyle(){
		if(this.element.style.text_color){
			document.documentElement.style.setProperty(`--radio-label_color`, this.element.style.text_color);
		}
		else{
			document.documentElement.style.setProperty(`--radio-label_color`, this.form.event_style.elements_label_color);
		}
	}

	isElementItalicize() : boolean{
		return this.element.style.italicize;
	}

	isLabelFullWidth() : boolean{
		return this.element.style.full_width_text == true || this.element.style.full_width_text == undefined ? true : false;
	}

}
