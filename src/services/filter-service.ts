import {Injectable} from "@angular/core";
import {FormSubmission, FormSubmissionType} from "../model";
import {GCFilter} from "../components/filters-view/gc-filter";
import * as moment from 'moment';

@Injectable()

export class FilterService {

  private gcFilters: GCFilter[];

  private setupFilters() {
    this.gcFilters = [
      {title: 'Name', id: 'name', icon:'information-circle-outline'},
      {title: 'Email', id: 'email', icon: 'at'},
      {title: 'Capture Type', id: 'captureType', icon: 'attach'},
      {title: 'Capture Date', id: 'date', icon: 'calendar'},
      {title: 'Captured By', id: 'capturedBy', icon: 'person'}];
  }

  filters() {
    if (!this.gcFilters) {
      this.setupFilters();
    }
    return this.gcFilters;
  }

  resetFilters() {
    this.setupFilters();
  }

  composeData(filter: GCFilter, submissions: FormSubmission[]) {
    if (filter.id == 'name') {
      return this.getUniqueNames(submissions);
    }

    if (filter.id == 'email') {
      return this.getUniqueEmails(submissions);
    }

    if (filter.id == 'email') {
      return this.getUniqueEmails(submissions);
    }

    if (filter.id == 'captureType') {
      return [FormSubmissionType.normal, FormSubmissionType.barcode, FormSubmissionType.list];
    }

    if (filter.id == 'date') {
      return this.getUniqueDates(submissions);
    }

    if (filter.id == 'capturedBy') {
      return this.getUniqueUsers(submissions);
    }
  }

  private getUniqueNames(submissions: FormSubmission[]) {
    return submissions.map((item) => item.first_name)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }

  private getUniqueEmails(submissions: FormSubmission[]) {
    return submissions.map((item) => item.email)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }

  private getUniqueDates(submissions: FormSubmission[]) {
    return submissions.map((item) => item.sub_date)
      .map((date) => {
        return moment(date).format('dddd, MMMM DD[th] YYYY');
      })
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }

  private getUniqueUsers(submissions: FormSubmission[]) {
    return submissions.map((item) => item.captured_by_user_name)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }
}
