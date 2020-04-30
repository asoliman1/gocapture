import { Component, Input, forwardRef } from '@angular/core';
import { BaseElement } from "../base-element";
import { FormElement, Form } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import {ModalController} from "ionic-angular";
import {OptionItem} from "../../../../model/option-item";
import {ISearch} from "../../../../views/search/search";
import {Util} from "../../../../util/util";

@Component({
	selector: 'dropdown',
	templateUrl: 'dropdown.html',
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Dropdown), multi: true }
	]
})
export class Dropdown extends BaseElement implements ISearch {

	@Input() element: FormElement = <any>{};
	@Input() formGroup: FormGroup;
	@Input() readonly: boolean = false;
	@Input() form: Form;

	constructor(private modal: ModalController) {
		super();
	}


  showOptions() {
	  if (!this.readonly) {
      let search = this.modal.create('SearchPage', {items: this.getOptions()});
      search.onDidDismiss(data => {
        this.currentVal = data;
      });
      search.present();
    }
  }

	writeValue(obj: any): void{
		if(!obj) {
			for(let i = 0; i < this.element.options.length; i++){
				if(this.element.options[i].is_default == 1){
					obj = this.element.options[i].option;
					break;
				}
			}
		} else if (this.element && this.element.options.filter((entry)=>{
			return entry.option == obj;
		}).length == 0) {
		  if (Util.isNumber(obj)) {
        obj = this.element.options[parseInt(obj)-1].option;
      }
		}
		super.writeValue(obj);
	}

	getOptions() {
	  let items = [];
    this.element.options.forEach((item) => {
      let optionItem = new OptionItem({
        id: item.position.toString(),
        title: this.itemValue(item),
        subtitle: null,
        search: this.itemValue(item),
        value: this.itemValue(item)});
      optionItem.isSelected = this.currentVal == this.itemValue(item);
      items.push(optionItem);
    });
    return items;
  }

  itemValue(item) {
	  return item.option_label || item.option;
  }

  isLabelVisible(element: FormElement){
    if (element.is_label_visible) return true;
    else return false;
  }
}
