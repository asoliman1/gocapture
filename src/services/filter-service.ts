import {Injectable} from "@angular/core";
import {Form, FormSubmission, FormSubmissionType} from "../model";
import {FilterType, GCFilter} from "../components/filters-view/gc-filter";
import {DateTimeUtil} from "../util/date-time-util";
import {iFilterItem} from "../model/protocol/ifilter-item";
import { TranslateService } from "@ngx-translate/core";

export enum Modifiers {
  Equals = 'equal',
  NotEqual = 'not_equal',
  Contains = 'contain',
  NotContain = 'not_contain',
  StartsWith = 'starts_with',
}

export interface Modifier {
  name: string;
  value: Modifiers;
}

@Injectable()

export class FilterService {

  constructor(
    private translate: TranslateService
  ){}

  private gcFilters: GCFilter[];

  private setupFilters() {
    this.gcFilters = [
      {title: this.translate.instant('filters-view.titles.name'), id: FilterType.Name, icon:'information-circle-outline'},
      {title: this.translate.instant('filters-view.titles.email'), id: FilterType.Email, icon: 'at'},
      {title: this.translate.instant('filters-view.titles.capture-method'), id: FilterType.CaptureType, icon: 'attach'},
      {title: this.translate.instant('filters-view.titles.capture-date'), id: FilterType.CaptureDate, icon: 'calendar'},
      {title: this.translate.instant('filters-view.titles.captured-by'), id: FilterType.CapturedBy, icon: 'person'}];
  }

  filters(shouldReset: boolean = false) {
    if (!this.gcFilters || shouldReset) {
      this.setupFilters();
    }
    return this.gcFilters;
  }

  clearFilters() {
    this.setupFilters();
  }

  modifiers(): Modifier[] {
    return [
      {name: this.translate.instant('filters-view.modifiers.equals'), value: Modifiers.Equals},
      {name: this.translate.instant('filters-view.modifiers.doesnt-equal'), value: Modifiers.NotEqual},
      {name: this.translate.instant('filters-view.modifiers.contains'), value: Modifiers.Contains},
      {name: this.translate.instant('filters-view.modifiers.does-not-contain'), value: Modifiers.NotContain}];
  }

  resetFilters() {
    this.setupFilters();
  }

  composeData(filter: GCFilter, submissions: FormSubmission[], form?: Form): iFilterItem[] {
    if (filter.id == FilterType.Name) {
      return this.getUniqueNames(submissions);
    }

    if (filter.id == FilterType.Email) {
      return this.getUniqueEmails(submissions);
    }

    if (filter.id == FilterType.CaptureType) {
      return [
        {title: this.translate.instant('filters-view.capture-type.normal'), value: FormSubmissionType.normal, displayedProperty: 'title'},
        {title: this.translate.instant('filters-view.capture-type.badge-scan'), value: FormSubmissionType.barcode, displayedProperty: 'title'},
        {title: this.translate.instant('filters-view.capture-type.list'), value: FormSubmissionType.list, displayedProperty: 'title'},
        {title: this.translate.instant('filters-view.capture-type.transcription'), value: FormSubmissionType.transcription, displayedProperty: 'title'}];
    }

    if (filter.id == FilterType.CaptureDate) {
      return this.getUniqueDates(submissions);
    }

    if (filter.id == FilterType.CapturedBy) {
      return form.available_for_users
        .map((user) => {
          return {value: user.user_name, displayedProperty: 'value'};
        })
        .sort((a, b) => a.value.localeCompare(b.value));
    }
  }

  static filterItems(items, filter, modifier) {
    let mappedItems = items.map(item => item.value);
    switch (modifier.value) {
      case Modifiers.Contains: {
        return FilterService.contains(mappedItems, filter);
      }
      case Modifiers.NotContain: {
        return !FilterService.contains(mappedItems, filter);
      }
      case Modifiers.Equals: {
        return FilterService.equals(mappedItems, filter);
      }
      case Modifiers.NotEqual: {
        return !FilterService.equals(mappedItems, filter);
      }
      case Modifiers.StartsWith: {
        return FilterService.startsWith(mappedItems, filter);
      }
    }
  }

  static contains(values, value) {
    for (let val of values) {
      if (value.toLowerCase().includes(val.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  static equals(values, value) {
    for (let val of values) {
      if (value.toLowerCase() == val.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  static startsWith(values, value) {
    for (let val of values) {
      if (value.toLowerCase().startsWith(val.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  private getUniqueNames(submissions: FormSubmission[]) {
    return submissions.map((item) => item.first_name + ' ' + item.last_name)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0)
      .map((item) => {
        return {value: item, displayedProperty: 'value'}
      }).sort((a, b) => a.value.localeCompare(b.value));
  }

  private getUniqueEmails(submissions: FormSubmission[]) {
    return submissions.map((item) => item.email)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0)
      .map((item) => {
        return {value: item, displayedProperty: 'value'}
      }).sort((a, b) => a.value.localeCompare(b.value));
  }

  private getUniqueDates(submissions: FormSubmission[]) {
    return submissions.map(item => DateTimeUtil.submissionDisplayedTime(item.sub_date))
    .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0)
      .map((item) => {
        return {value: item, displayedProperty: 'value'}
      });
  }

  private getUniqueUsers(submissions: FormSubmission[]) {
    return submissions.map((item) => item.captured_by_user_name)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0)
      .map((item) => {
        return {value: item, displayedProperty: 'value'}
      } );
  }
}
