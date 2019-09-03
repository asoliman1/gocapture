import {Injectable} from "@angular/core";
import {FormSubmission, FormSubmissionType} from "../model";
import {GCFilter} from "../components/filters-view/gc-filter";

@Injectable()

export class FilterService {

  private gcFilters: GCFilter[];

  private setupFilters() {
    this.gcFilters = [
      {title: 'Prospect Name', id: 'name', icon:'information-circle-outline'},
      {title: 'Prospect Email', id: 'email', icon: 'at'},
      {title: 'Capture Type', id: 'captureType', icon: 'attach'},
      {title: 'Date', id: 'date', icon: 'calendar'},
      {title: 'Person who capture the lead', id: 'person', icon: 'person'}];
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
  }

  private getUniqueNames(submissions: FormSubmission[]) {
    return submissions.map((item) => item.first_name)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }

  private getUniqueEmails(submissions: FormSubmission[]) {
    return submissions.map((item) => item.email)
      .filter((value, index, self) => self.indexOf(value) === index && value && value.length > 0);
  }
}
