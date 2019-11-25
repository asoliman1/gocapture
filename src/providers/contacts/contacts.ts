import { FormsProvider } from './../forms/forms';
import { DBClient } from './../../services/db-client';
import { Injectable } from '@angular/core';
import { DownloadData } from '../../services/sync-client';
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
    private rest : RESTClient,
    private db : DBClient,
    private formsProvider : FormsProvider
    ) {
  }

  public downloadContacts(): Observable<any> {
    console.log('Getting latest contacts...')
    let forms = this.formsProvider.forms.filter((form) => form.list_id > 0);
    return new Observable<any>(obs => {
      this.rest.getAllDeviceFormMemberships(forms).subscribe((data) => {
        this.db.saveMemberships(data.contacts).subscribe(()=>obs.next(data.contacts),obs.error);
        this.formsProvider.updateFormLastSync(data.form.form_id,'contacts');
        // console.log(data);
      },obs.error,obs.complete)
    });
  }
  
}
