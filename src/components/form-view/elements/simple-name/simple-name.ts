import { Component, EventEmitter, Input, Output } from '@angular/core';
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

	@Input() selection: boolean = false;

	@Output() idSelected: EventEmitter<string>;

	nameMap = {
		"FirstName": "First Name",
		"LastName": "Last Name"
	}

	constructor() {
		super();
		this.idSelected = new EventEmitter<string>();
	}

	ngOnChanges(changes: any) {
		super.ngOnChanges(changes);
	}

	selectEntry(identifier){
		this.idSelected.emit(identifier);
	}

	protected config(){
		super.config();
		if(this.mapping && this.mapping[0].label == "LastName"){
			this.mapping.reverse();
		}
	}
}