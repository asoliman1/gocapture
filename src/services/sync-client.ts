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
  private currentSyncingForms: formSyncStatus[] = [];

  constructor(
    private contactsProvider: ContactsProvider,
    private documentsSync: DocumentsSyncClient,
    private formsProvider: FormsProvider,
    private submissionsProvider: SubmissionsProvider,
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
      // this.initFormsSyncing();
      this.formsProvider.downloadForms(lastSyncDate).subscribe(() => {
        this.initFormsSyncing();
        this.submissionsProvider.downloadSubmissions(this.currentSyncingForms).subscribe(
          (data) => {
            // console.log(data, 'submissions sync')
            this.rmFormSyncItem(data);
          },
          (err) => this.pushError(obs, err),
          () => {
            this._isSyncing = false;
            console.log('Submissions Synced')
            obs.complete();
            this.documentsSync.syncAll();
          });
        this.contactsProvider.downloadContacts(this.currentSyncingForms).subscribe(
          (data) => {
            // console.log(data, 'contacts sync')
            this.rmFormSyncItem(data);
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

  private checkFormSyncStatus(formId: number) {
    let el = this.currentSyncingForms.find((e) => e.formId == formId),
    syncStatus = el ? el.syncStatus : false;
    this.formsProvider.updateFormSyncStatus(formId, syncStatus);
    if (!syncStatus) this.rmFromCurrentSyncing(formId);
  }

  private initFormsSyncing() {
    this.formsProvider.forms.forEach((e) => this.currentSyncingForms.push(new formSyncStatus(e.form_id)));
    this.formsProvider.setFormsSyncStatus(true);
  }

  private rmFromCurrentSyncing(formId: number) {
    this.currentSyncingForms = this.currentSyncingForms.filter((e) => e.formId != formId);
  }

  private rmFormSyncItem(formId: number) {
    let el = this.currentSyncingForms.find((e) => e.formId == formId);
    if(el) el.rmFromItems();
    this.checkFormSyncStatus(formId);
  }

}

export class formSyncStatus {
  formId: number;
  syncStatus: boolean;
  itemsSyncing: any[] = [];

  constructor(formId: number) {
    this.formId = formId;
    this.addToitems();
  }

  addToitems() {
    this.itemsSyncing.push(1);
    this.checkSyncStatus();
  }

  rmFromItems() {
    this.itemsSyncing.pop();
    this.checkSyncStatus();
  }

  private checkSyncStatus() {
    if (this.itemsSyncing.length) this.syncStatus = true;
    else this.syncStatus = false;
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
