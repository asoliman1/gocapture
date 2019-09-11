import {Injectable} from "@angular/core";
import {FormSubmission, FormSubmissionType} from "../model";
import {FilterType, GCFilter} from "../components/filters-view/gc-filter";
import * as moment from 'moment';

export enum Modifiers {
  Equals = 'equal',
  NotEqual = 'not_equal',
  Contains = 'contain',
  NotContain = 'not_contain',
  StartsWith = 'starts_with',

}

@Injectable()

export class FilterService {

  private gcFilters: GCFilter[];

  private setupFilters() {
    this.gcFilters = [
      {title: 'Name', id: FilterType.Name, icon:'information-circle-outline'},
      {title: 'Email', id: FilterType.Email, icon: 'at'},
      {title: 'Capture Method', id: FilterType.CaptureType, icon: 'attach'},
      {title: 'Capture Date', id: FilterType.CaptureDate, icon: 'calendar'},
      {title: 'Captured By', id: FilterType.CapturedBy, icon: 'person'}];
  }

  filters() {
    if (!this.gcFilters) {
      this.setupFilters();
    }
    return this.gcFilters;
  }

  static modifiers() {
    return [
      {name: 'Equals', value: Modifiers.Equals},
      {name: 'Does not equal', value: Modifiers.NotEqual},
      {name: 'Contains', value: Modifiers.Contains},
      {name: 'Does not contain', value: Modifiers.NotContain}];
  }

  resetFilters() {
    this.setupFilters();
  }

  composeData(filter: GCFilter, submissions: FormSubmission[]) {
    if (filter.id == FilterType.Name) {
      return this.getUniqueNames(submissions);
    }

    if (filter.id == FilterType.Email) {
      return this.getUniqueEmails(submissions);
    }

    if (filter.id == FilterType.CaptureType) {
      return [
        {title: "Normal", value: FormSubmissionType.normal},
        {title: "Badge Scan", value: FormSubmissionType.barcode},
        {title: "List", value: FormSubmissionType.list},
        {title: "Transcription", value: FormSubmissionType.transcription}];
    }

    if (filter.id == FilterType.CaptureDate) {
      return this.getUniqueDates(submissions);
    }

    if (filter.id == FilterType.CapturedBy) {
      return this.getUniqueUsers(submissions);
    }
  }

  static filterItems(items, filter, modifier) {
    switch (modifier) {
      case Modifiers.Contains: {
        return FilterService.contains(items, filter);
      }
      case Modifiers.NotContain: {
        return !FilterService.contains(items, filter);
      }
      case Modifiers.Equals: {
        return FilterService.equals(items, filter);
      }
      case Modifiers.NotEqual: {
        return !FilterService.equals(items, filter);
      }
      case Modifiers.StartsWith: {
        return FilterService.startsWith(items, filter);
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
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }

  private getUniqueEmails(submissions: FormSubmission[]) {
    return submissions.map((item) => item.email)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }

  private getUniqueDates(submissions: FormSubmission[]) {
    return submissions.map((item) =>  {
      return { formattedDate: moment(item.sub_date).format('dddd, MMMM DD[th] YYYY'), original: item.sub_date}
    }).filter((value, index, self) => self.indexOf(value) === index && value && value.formattedDate.length > 0);
  }

  private getUniqueUsers(submissions: FormSubmission[]) {
    return submissions.map((item) => item.captured_by_user_name)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }
}
