import { Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormElement } from "../../../model";
import { FormGroup, ControlValueAccessor } from "@angular/forms";
import { Subscription } from "rxjs";

export class BaseElement implements OnChanges, ControlValueAccessor {

	element: FormElement;
	name: string;
	formControlName: string;

	propagateChange:any = () => {};
    validateFn:any = () => {};

	currentValue: any = "";

	constructor() {

	}

	ngOnChanges(changes: SimpleChanges){
		if(this.element){
			this.name = this.element.id + "";
			this.formControlName = this.element["identifier"];
		}
	}

	writeValue(obj: any): void{
		this.currentValue = obj;
	}
	
    registerOnChange(fn: any): void{
		this.propagateChange = fn;
	}

    registerOnTouched(fn: any): void{

	}
	
    setDisabledState?(isDisabled: boolean): void{

	}

	onChange(value){
		this.currentValue = value;
		this.propagateChange(value);
	}
}