import {Component, EventEmitter, Output} from '@angular/core';
import {GCFilter} from "./gc-filter";
import {FilterService} from "../../services/filter-service";

@Component({
  selector: 'filters-view',
  templateUrl: 'filters-view.html'
})

export class FiltersViewComponent {

  @Output() onFilterSelected = new EventEmitter();

  filters: GCFilter[] = [];

  selectedFilter: GCFilter;

  constructor(private filterService: FilterService) {
    this.setupFilter();
  }

  private setupFilter() {
    this.filters = this.filterService.filters();
  }

  onSelect(filter) {
    this.selectedFilter = filter;
    this.onFilterSelected.emit(filter);
  }

}
