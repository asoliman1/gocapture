import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormElement } from "../../../../model";
import { FormGroup, FormControl } from "@angular/forms";
import { BaseGroupElement} from "../base-group-element";

@Component({
	selector: 'address',
	templateUrl: 'address.html'
})
export class Address extends BaseGroupElement {
	@Input() element: any;
	@Input() rootGroup: FormGroup;
	@Input() readonly: boolean = false;
	@Input() selection: boolean = false;
	@Output() idSelected: EventEmitter<string>;

	constructor() {
		super();
		this.idSelected = new EventEmitter<string>();
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
	
	selectEntry(identifier){
		this.idSelected.emit(identifier);
	}
}