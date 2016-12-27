import { Component, Input } from '@angular/core';
import { FormElement } from "../../../../model";
import { AbstractControl, FormGroup, FormControl } from "@angular/forms";
import { BaseGroupElement} from "../base-group-element";

@Component({
	selector: 'address',
	templateUrl: 'address.html'
})
export class Address extends BaseGroupElement {
	@Input() element: any;
	@Input() rootGroup: FormGroup;

	constructor() {
		super();
	}

	ngOnChanges(changes: any) {
		if(this.element){
			for(var i = 1; i< 7; i++){
				if(!this.group.get(this.element.identifier + "_" + i)){
					this.group.addControl(this.element.identifier + "_" + i, new FormControl());
				}
			}
		}
		super.ngOnChanges(changes);
	}	
}