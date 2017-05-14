import { Component, Input } from '@angular/core';
import { FormElement } from "../../../../model";
import { FormGroup } from "@angular/forms";
import { BaseGroupElement} from "../base-group-element";

@Component({
	selector: 'simple-name',
	templateUrl: 'simple-name.html'
})
export class SimpleName extends BaseGroupElement {

	@Input() element: FormElement;
	
	@Input() rootGroup: FormGroup;

	@Input() readonly: boolean = false;

	nameMap = {
		"FirstName": "First Name",
		"LastName": "Last Name"
	}

	constructor() {
		super();
	}

	ngOnChanges(changes: any) {
		super.ngOnChanges(changes);
	}

	protected config(){
		super.config();
		if(this.mapping && this.mapping[0].label == "LastName"){
			this.mapping.reverse();
		}
	}
}