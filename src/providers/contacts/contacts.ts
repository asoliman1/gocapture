import { FormsProvider } from './../forms/forms';
import { DBClient } from './../../services/db-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RESTClient } from '../../services/rest-client';

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

  public downloadContacts(): Observable<any> {
    console.log('Getting latest contacts...')
    return new Observable<any>(obs => {
      this.rest
        .getAllDeviceFormMemberships(this.formsHaveContacts())
        .mergeMap(
          (data) => this.db
            .saveMemberships(data.contacts)
            .map((saved) => { return { saved, form: data.form, all: data.all } })
        )
        .subscribe((data) => {
          if (data && data.form.form_id && data.saved && data.all) {
            obs.next(data.form.form_id);
          }
        }, (err) => {
          obs.error(err)
        }, () => {
          obs.complete();
        })
    });

  }


  private formsHaveContacts() {
    let forms = this.formsProvider.forms.filter((form) => form.list_id > 0);
    return forms;
  }


}
