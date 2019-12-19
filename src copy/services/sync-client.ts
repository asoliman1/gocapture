import { ContactsProvider } from './../providers/contacts/contacts';
import { SubmissionsProvider } from './../providers/submissions/submissions';
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
import { DocumentsSyncClient } from './documents-sync-client';


@Injectable()
export class SyncClient {

  private errorSource: BehaviorSubject<any>;
  /**
   * Error event
   */
  error: Observable<any>;

  private _isSyncing: boolean = false;

  constructor(
    private contactsProvider: ContactsProvider,
    private documentsSync: DocumentsSyncClient,
    private formsProvider: FormsProvider,
    private submissionsProvider : SubmissionsProvider,
    ) {
    this.errorSource = new BehaviorSubject<any>(null);
    this.error = this.errorSource.asObservable();

  }

  public isSyncing(): boolean {
    return this._isSyncing;
  }

  public download(lastSyncDate: Date): Observable<DownloadData> {
    return new Observable<DownloadData>((obs: Observer<DownloadData>) => {
      this._isSyncing = true;
      this.formsProvider.downloadForms(lastSyncDate).subscribe(() => {
      
        this.submissionsProvider.downloadSubmissions().subscribe(
        () => {}, 
        (err) => this.pushError(obs,err), 
        () => {
          this._isSyncing = false;
          console.log('Submissions Synced')
          obs.complete();
          this.documentsSync.syncAll();
        });
        this.contactsProvider.downloadContacts().subscribe(
        () => {}, 
        (err) => this.pushError(obs,err) , 
        ()=> console.log('Contacts Synced'));
      }, 
      (err) => this.pushError(obs,err) , 
      ()=> console.log('Forms Synced'));
    });
  }

  pushError(obs:Observer<DownloadData>,err){
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
