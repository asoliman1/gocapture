import { ContactsProvider } from './../providers/contacts/contacts';
import { Form } from './../model/form';
import { FormsProvider } from './../providers/forms/forms';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import {
  DeviceFormMembership,
  FormSubmission,
  SyncStatus
} from "../model";


@Injectable()
export class SyncClient {

  private errorSource: BehaviorSubject<any>;
  /**
   * Error event
   */
  error: Observable<any>;

  constructor(
    private contactsProvider: ContactsProvider,
    private formsProvider: FormsProvider,
  ) {
    this.errorSource = new BehaviorSubject<any>(null);
    this.error = this.errorSource.asObservable();

  }


  public download(lastSyncDate: Date): Observable<DownloadData> {
    return new Observable<DownloadData>((obs: Observer<DownloadData>) => {
      this.formsProvider.downloadForms(lastSyncDate).subscribe(() => {

        this.contactsProvider.downloadContacts().subscribe(
          (data) => {
 
          },
          (err) => this.pushError(obs, err),
          () => console.log('Contacts Synced'));
      },
        (err) => this.pushError(obs, err),
        () => console.log('Forms Synced'));
    });
  }

  pushError(obs: Observer<DownloadData>, err) {
    console.log(err)
    obs.error(err);
    this.errorSource.next(err);
  }

}

export class DownloadData {
  forms: Form[] = [];
  memberships: DeviceFormMembership[] = [];
  submissions: FormSubmission[] = [];
  newFormIds: number[] = [];
}

export class FormMapEntry {
  form: Form;
  urlFields: string[];
  status: SyncStatus;
  submissions: FormSubmission[];
}
