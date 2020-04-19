import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { BaseGroupElement} from "../base-group-element";
import {ISearch} from "../../../../views/search/search";
import {Countries} from "../../../../constants/constants";
import {OptionItem} from "../../../../model/option-item";
import {ModalController} from "ionic-angular";

@Component({
	selector: 'address',
	templateUrl: 'address.html'
})
export class Address extends BaseGroupElement implements ISearch {

  country: string;
  countries: any[];

	@Input() element: any;
	@Input() rootGroup: FormGroup;
	@Input() readonly: boolean = false;
	@Input() selection: boolean = false;
	@Output() idSelected: EventEmitter<string>;

	constructor(private modal: ModalController) {
		super();
		this.idSelected = new EventEmitter<string>();
		this.countries = Countries;
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

  showOptions() {
    if (!this.readonly) {
      let search = this.modal.create('SearchPage', {items: this.getOptions()});
      search.onDidDismiss(data => {
        if (data) {
          this.country = data.value;
        }
      });
      search.present();
    }
  }

  getOptions() {
    let items = [];
    Countries.forEach((country, index) => {
      let optionItem = new OptionItem({
        id: index.toString(),
        title: country.name,
        subtitle: null,
        search:country.name,
        value: country
      });
      items.push(optionItem);
      if (this.country && (this.country == country.name)) {
        optionItem.isSelected = true;
      }
    });
    return items;
  }

  isLabelVisible(element: any){
    if (element.is_label_visible) return true;
    else return false;
  }
}
