import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GCFilter} from "./gc-filter";
import {FilterService} from "../../services/filter-service";

@Component({
  selector: 'filters-view',
  templateUrl: 'filters-view.html'
})

export class FiltersViewComponent {

  @Output() onFilterSelected = new EventEmitter();
  @Input() filters: GCFilter[];

  selectedFilter: GCFilter;

  constructor() {
    //
  }

  onSelect(filter) {
    this.selectedFilter = filter;
    this.onFilterSelected.emit(filter);
  }

}
