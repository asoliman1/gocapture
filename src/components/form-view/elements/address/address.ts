import { Component, Input } from '@angular/core';
import { FormElement } from "../../../../model";
import { AbstractControl, FormGroup } from "@angular/forms";
import { BaseGroupElement} from "../base-group-element";

@Component({
	selector: 'address',
	templateUrl: 'address.html'
})
export class Address extends BaseGroupElement {
	@Input() element: FormElement;
	@Input() rootGroup: FormGroup;

	constructor() {
		super();
	}
}