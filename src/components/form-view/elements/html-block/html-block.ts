import { Component, Input, Output } from '@angular/core';
import { FormElement } from "../../../../model";
import { FormGroup } from "@angular/forms";
import { BaseGroupElement } from "../base-group-element";

@Component({
	selector: 'html-block',
	templateUrl: 'html-block.html'
})
export class HTMLBlock extends BaseGroupElement {

	@Input() element: FormElement;

	@Input() rootGroup: FormGroup;

	@Input() readonly: boolean = false;

	isCollapsed = true;

	btnColor: string = 'dark';

	constructor() {
		super();
	}

	onExpandCollapse() {
		if (this.element["collapse_content"]) {
			this.isCollapsed = !this.isCollapsed;
			// document.getElementById('html-block').scrollIntoView({ behavior: 'auto', block: 'center' });
		};
	}

	isContentCollapsed() {
		return this.element["collapse_content"] && this.isCollapsed;
	}
}
