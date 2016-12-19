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
}