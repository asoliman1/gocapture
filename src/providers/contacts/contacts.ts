import { FormsProvider } from './../forms/forms';
import { DBClient } from './../../services/db-client';
import { Injectable } from '@angular/core';
import { DownloadData, formSyncStatus } from '../../services/sync-client';
import { Observable } from 'rxjs';
import { RESTClient } from '../../services/rest-client';
import { Form } from '../../model';

/*
  Generated class for the ContactsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactsProvider {

  constructor(
    private rest: RESTClient,
    private db: DBClient,
    private formsProvider: FormsProvider
  ) {
  }

  public downloadContacts(currentSyncingForms: formSyncStatus[]): Observable<any> {
    console.log('Getting latest contacts...')
    return new Observable<any>(obs => {
      this.rest
        .getAllDeviceFormMemberships(this.formsHaveContacts(currentSyncingForms))
        .mergeMap(
          (data) => this.db
            .saveMemberships(data.contacts)
            .map((saved) => { return { saved, form: data.form, all: data.all } })
        )
        .subscribe((data) => {
          if (data && data.form.form_id && data.saved && data.all) {
            this.formsProvider.updateFormLastSync(data.form.form_id, 'contacts');
            obs.next(data.form.form_id);
          }
        }, (err) => {
          obs.error(err)
        }, () => {
          obs.complete();
        })
    });

  }

  private addToFormSyncItems(currentSyncForms: formSyncStatus[], formId: number) {
    currentSyncForms.find((e) => e.formId == formId).addToitems();
  }

  private formsHaveContacts(currentSyncingForms: formSyncStatus[]) {
    let forms = this.formsProvider.forms.filter((form) => form.list_id > 0);
    forms.forEach((e) => this.addToFormSyncItems(currentSyncingForms, e.form_id));
    return forms;
  }


}
