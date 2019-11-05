import { FormCapture } from './../views/form-capture/form-capture';
import { Form } from './../model/form';
import { FormsProvider } from './../providers/forms/forms';
import { Image } from './../model/image';
import { SettingsService } from './settings-service';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';

import { File, Entry } from '@ionic-native/file';
import {
  BarcodeStatus,
  DeviceFormMembership,
  FormElementType,
  FormSubmission,
  SubmissionStatus,
  SyncStatus
} from "../model";
import { FileUploadRequest } from "../model/protocol";
import { HTTP } from '@ionic-native/http';
import { settingsKeys } from '../constants/constants';
import { SubmissionsRepository } from "./submissions-repository";
import { DocumentsSyncClient } from './documents-sync-client';
import { Util } from '../util/util';


@Injectable()
export class SyncClient {

  private errorSource: BehaviorSubject<any>;
  /**
   * Error event
   */
  error: Observable<any>;

  private syncSource: BehaviorSubject<SyncStatus[]>;
  /**
   * Sync update event
   */
  onSync: Observable<SyncStatus[]>;

  private entitySyncedSource: BehaviorSubject<string>;
  /**
   * Sync update event
   */
  entitySynced: Observable<string>;

  /**
   * Duplicate lead event
   */
  private duplicateLeadSource: BehaviorSubject<any>;
  duplicateLead: Observable<any>;

  private _isSyncing: boolean = false;

  private lastSyncStatus: SyncStatus[];

  private dataUrlRegexp: RegExp = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

  // A.S
  private hasNewData: boolean;

  constructor(private rest: RESTClient,
    private db: DBClient,
    private file: File,
    private http: HTTP,
    private settingsService: SettingsService,
    private documentsSync: DocumentsSyncClient,
    private submissionsRepository: SubmissionsRepository,
    private formsProvider: FormsProvider,
    private util: Util) {
    this.errorSource = new BehaviorSubject<any>(null);
    this.error = this.errorSource.asObservable();
    this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
    this.onSync = this.syncSource.asObservable();
    this.entitySyncedSource = new BehaviorSubject<string>(null);
    this.entitySynced = this.entitySyncedSource.asObservable();
    this.duplicateLeadSource = new BehaviorSubject<any>(null);
    this.duplicateLead = this.duplicateLeadSource.asObservable();
  }

  public isSyncing(): boolean {
    return this._isSyncing;
  }

  public getLastSync(): SyncStatus[] {
    return this.lastSyncStatus;
  }

  // A.S
  public setSync(status) {
    console.log('Sync is off');
    this._isSyncing = status;
  }

  public download(lastSyncDate: Date): Observable<DownloadData> {
    return new Observable<DownloadData>((obs: Observer<DownloadData>) => {
      let result = new DownloadData();
      this._isSyncing = true;

      console.log('Getting latest forms...')
      this.downloadForms(lastSyncDate, result).subscribe((forms) => {
        // A.S check if form has data to be downloaded
        if (this.hasNewData) {
          // A.S GOC-326
          this.downloadFormsData(forms);
        }
        obs.next(result);
        console.log('Getting latest submissions...')
        this.downloadSubmissions(forms, lastSyncDate, result).subscribe(() => { }, (err) => {
          console.log(err)
          obs.error(err);
        }, () => {
          this._isSyncing = false;
          obs.next(result);
          obs.complete();
          console.log('Getting latest documents...');
          this.documentsSync.syncAll();
        });
        console.log('Getting latest contacts...')
        let formsWithList = forms.filter((form) => form.list_id > 0);
        this.downloadContacts(formsWithList, result).subscribe(() => {
          formsWithList.forEach((form) => {
            form.members_last_sync_date = new Date().toISOString().split(".")[0] + "+00:00";
          });
          this.formsProvider.saveNewForms(formsWithList);
        }, (err) => {
          obs.error(err);
        });
      }, (err) => {
        obs.error(err);
      });
    });
  }


  private syncCleanup() {
    this._isSyncing = false;
    this.syncSource.complete();
    this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
    this.onSync = this.syncSource.asObservable();
  }

  public sync(submissions: FormSubmission[], forms: Form[]): Observable<FormSubmission[]> {
    return new Observable<FormSubmission[]>(obs => {
      let result = [];

      this._isSyncing = true;
      let map: { [key: number]: FormMapEntry } = {};
      this.lastSyncStatus = [];
      forms.forEach(form => {
        map[form.form_id + ""] = {
          form: form,
          urlFields: form.getUrlFields(),
          submissions: [],
          status: new SyncStatus(false, false, form.form_id, form.name)
        };
      });
      submissions.forEach(sub => {
        map[sub.form_id + ""].submissions.push(sub);
      });

      let formIds = Object.keys(map);
      let index = 0;
      map[formIds[index]].status.loading = true;

      let onError = (err) => {
        this.syncCleanup();
        obs.error(err);
        this.errorSource.next(err);
        // A.S
        this.formsProvider.updateFormSyncStatus(formIds[index], false);
      };

      let handler = (submitted: FormSubmission[]) => {
        result.push.apply(result, submitted);
        map[formIds[index]].status.complete = true;
        map[formIds[index]].status.loading = false;
        // A.S
        this.formsProvider.updateFormSyncStatus(formIds[index], false);
        index++;
        if (index >= formIds.length) {
          obs.next(result);
          obs.complete();
          this.lastSyncStatus = [];
          this.syncCleanup()
          return;
        }
        setTimeout(() => {
          // A.S
          this.formsProvider.updateFormSyncStatus(formIds[index], true);
          this.doSubmitAll(map[formIds[index]]).subscribe(handler, onError);
        }, 500);
      };
      // A.S
      this.formsProvider.updateFormSyncStatus(formIds[index], true);
      this.doSubmitAll(map[formIds[index]]).subscribe(handler, onError);
    });
  }

  private doSubmitAll(data: FormMapEntry): Observable<FormSubmission[]> {
    return new Observable<FormSubmission[]>((obs: Observer<FormSubmission[]>) => {
      let result = [];
      var index = 0;
      console.log("Submit All");
      let handler = () => {

        if (index == data.submissions.length) {
          obs.next(result);
          obs.complete();
          return;
        }

        this.doSubmit(data, index).subscribe((submission) => {
          // A.S
          this.formsProvider.updateFormSubmissions(data.form.form_id);
          setTimeout(() => {
            result.push(submission);
            index++;
            handler();
          });

        }, (err) => {
          index++;
          handler();
        });
      };
      handler();
    });
  }

  private buildUrlMap(submission: FormSubmission, urlFields: string[], urlMap: { [key: string]: string }): boolean {
    let hasUrls = false;
    for (var field in submission.fields) {
      if (urlFields.indexOf(field) > -1) {
        let sub = submission.fields[field];
        if (sub) {
          var val = [];
          if (typeof (sub) == "object") {
            Object.keys(sub).forEach((key) => {
              val.push(sub[key]);
            });
          } else {
            val = val.concat(sub);
          }
          val.forEach((url) => {
            if (url) {
              urlMap[url] = url;
              hasUrls = true;
            }
          });
        }
      }
    }
    return hasUrls;
  }


  private doSubmit(data: FormMapEntry, index: number): Observable<FormSubmission> {

    return new Observable<FormSubmission>((obs: Observer<FormSubmission>) => {
      let submission = data.submissions[index];
      let urlMap: { [key: string]: string } = {};
      this.buildUrlMap(submission, data.urlFields, urlMap);

      console.log("Do submit");

      let uploadUrlMap = {};
      Object.keys(urlMap).forEach((key) => {
        if (key.startsWith("file://") || key.startsWith("data:image")) {
          uploadUrlMap[key] = urlMap[key];
        }
      });

      let hasUrls = Object.keys(uploadUrlMap).length > 0;

      console.log("Submission has urls - " + JSON.stringify(hasUrls));

      this.uploadData(uploadUrlMap, hasUrls).subscribe((uploadedData) => {

        console.log("Submission uploaded data");

        this.updateUrlMapWithData(uploadUrlMap, uploadedData);

        Object.keys(uploadUrlMap).forEach((key) => {
          urlMap[key] = uploadUrlMap[key];
        });

        this.updateSubmissionFields(submission, data, urlMap);

        this.db.updateSubmissionFields(data.form, submission).subscribe((done) => {
          console.log("Updated submission fields - " + JSON.stringify(submission));
          if (submission.barcode_processed == BarcodeStatus.Queued && !submission.hold_submission) {
            this.processBarcode(data, submission, obs);
          } else if ((submission.barcode_processed == BarcodeStatus.Processed) && !submission.hold_submission && !this.isSubmissionValid(submission)) {
            this.processBarcode(data, submission, obs);
          } else {
            this.actuallySubmitForm(data.form, submission, obs);
          }
        }, (err) => {
          obs.error(err);
          this.errorSource.next("Could not save updated submission for form " + data.form.name);
        });

      }, (err) => {
        obs.error(err);
        // let msg = "Could not process submission for form " + data.form.name;
        // this.errorSource.next(msg);
      });
    });
  }

  private updateUrlMapWithData(urlMap: { [p: string]: string }, data) {
    let urls = Object.keys(urlMap);

    urls.forEach((url, index) => {
      if (data) {
        let dataFile = data[index];
        if (dataFile && dataFile.length > 0) {
          urlMap[url] = dataFile[0]['url'];
        }
      } else {
        urlMap[url] = url;
      }
    });
  }

  private updateSubmissionFields(submission, data, urlMap: { [p: string]: string }) {
    for (let field in submission.fields) {
      if (data.urlFields.indexOf(field) > -1) {
        let sub = submission.fields[field];
        if (sub) {
          if (typeof (sub) == "object") {
            Object.keys(sub).forEach((key) => {
              sub[key] = urlMap[sub[key]];
            });
          } else if (Array.isArray(sub)) {
            for (let i = 0; i < sub.length; i++) {
              sub[i] = urlMap[sub[i]];
            }
          } else {
            submission.fields[field] = urlMap[sub];
          }
        }
      }
    }
  }

  private processBarcode(data: FormMapEntry, submission, obs: Observer<FormSubmission>) {
    let identifier = data.form.getIdByFieldType(FormElementType.barcode);
    let form = data.form.getFieldByIdentifier(identifier);
    this.rest.fetchBadgeData(<any>submission.fields[identifier], form.barcode_provider_id, submission.is_rapid_scan, data.form.form_id + '')
      .subscribe((fetchedData) => {

        let barcodeData = fetchedData.info;

        if (!barcodeData || barcodeData.length == 0) {
          return;
        }

        console.log("Barcode data: " + JSON.stringify(barcodeData));

        submission.barcode_processed = BarcodeStatus.Processed;

        barcodeData.forEach(entry => {
          let id = data.form.getIdByUniqueFieldName(entry.ll_field_unique_identifier);
          if (!id) {
            return;
          }
          submission.fields[id] = entry.value;
        });

        this.db.updateSubmissionFields(data.form, submission).subscribe((done) => {
          this.actuallySubmitForm(data.form, submission, obs, JSON.stringify(barcodeData));
        }, (err) => {
          obs.error(err);
          this.errorSource.next("Could not save updated barcode info into the submission for form " + data.form.name);
        });
      }, (err) => {
        console.error(err);

        console.log('Process barcode error - ' + JSON.stringify(err));

        if (err && err.status == 400 && form.accept_invalid_barcode) {
          submission.hold_submission = 1;
          submission.hold_submission_reason = err.message ? err.message : "";
          submission.barcode_processed = BarcodeStatus.Processed;
          this.db.updateSubmissionFields(data.form, submission).subscribe((done) => {
            this.actuallySubmitForm(data.form, submission, obs);
          });
        } else {
          obs.error(err);
          let msg = "Could not process submission for form " + data.form.name + ": barcode processing failed";
          this.errorSource.next(msg);
        }
      });
  }

  private actuallySubmitForm(form: Form, submission: FormSubmission, obs: Observer<any>, barcodeData?: string) {

    console.log("Submit form: " + JSON.stringify(submission));
    if (barcodeData) {
      console.log("With Barcode data: " + barcodeData);
    }

    this.rest.submitForm(submission).subscribe((d) => {
      this.settingsService.getSetting(settingsKeys.AUTO_UPLOAD).subscribe((setting) => {
        const autoUpload = String(setting) == "true";

        if (autoUpload && d.response_status != "200" && d.duplicate_action == "edit") {
          d.id = submission.id;
          d.form_id = submission.form_id;

          obs.complete();
          this.duplicateLeadSource.next(d);
          this.duplicateLeadSource.next(null);
          return;
        }

        if (((!d.id || d.id < 0) && (!d.hold_request_id || d.hold_request_id < 0)) || d.response_status != "200") {
          let msg = "Could not process submission for form \"" + form.name + "\": " + d.message;
          submission.invalid_fields = 1;
          submission.hold_request_id = 0;
          submission.status = SubmissionStatus.InvalidFields;
          this.db.updateSubmissionId(submission).subscribe((ok) => {
            obs.error(msg);
            this.errorSource.next(msg);
          }, err => {
            obs.error(err);
            let msg = "Could not process submission for form " + form.name;
            this.errorSource.next(msg);
          });
          return;
        }

        if (d.is_new_submission == false) {
          this.db.deleteSubmission(submission).subscribe();
          obs.complete();
          return;
        }

        if (d.id > 0) {
          submission.activity_id = d.id;
          submission.status = SubmissionStatus.Submitted;
        } else {
          submission.hold_request_id = d.hold_request_id;
          submission.status = SubmissionStatus.OnHold;
        }

        this.submissionsRepository.handleMergedSubmission(d.id, submission, d.submission, form)
          .subscribe((ok) => {
            if (d.id > 0) {
              submission.id = submission.activity_id;
            }
            obs.next(submission);
            obs.complete();
          }, err => {
            obs.error(err);
            let msg = "Could not process submission for form " + form.name;
            this.errorSource.next(msg);
            msg += ". Error - " + err;
            console.error(msg);
          });
      }, err => {
        obs.error(err);
        let msg = "Could not process submission for form " + form.name;
        this.errorSource.next(msg);

      })
      this.entitySyncedSource.next("Submissions"); // A.S push new submission updates to update number of submissions for each event

    }, err => {
      obs.error(err);
      let msg = "Could not process submission for form " + form.name;
      this.errorSource.next(msg);
      msg += ". Error - " + err;
      console.error(msg);
    });

  }

  private isSubmissionValid(submission: FormSubmission) {
    return (submission.first_name.length > 0 && submission.last_name.length > 0) || submission.email.length > 0;
  }

  private uploadData(urlMap: { [key: string]: string }, hasUrls: boolean): Observable<any> {
    return new Observable<any>((obs: Observer<any>) => {

      //handle only those urls that were not uploaded before
      let urls = Object.keys(urlMap).filter(url => {
        return !url.startsWith("https://")
      });

      if (!hasUrls || urls.length == 0) {
        obs.next(null);
        obs.complete();
        return;
      }

      let index = 0;

      let filesUploader = [];

      let handler = () => {
        let request = new FileUploadRequest();
        if (index >= urls.length) {
          Observable.zip(...filesUploader).subscribe((data) => {
            obs.next(data);
            obs.complete();
          }, err => {
            obs.error(err);
          })
        } else {

          let folder = urls[index].substr(0, urls[index].lastIndexOf("/"));
          let file = urls[index].substr(urls[index].lastIndexOf("/") + 1);

          this.file.resolveDirectoryUrl(folder)
            .then(dir => {
              return this.file.getFile(dir, file, { create: false })
            })
            .then(fileEntry => {

              fileEntry.getMetadata((metadata) => {

                this.file.readAsDataURL(folder, file)
                  .then((data: string) => {
                    let entry = this.util.createFile(data, file, metadata.size);
                    request.files.push(entry);
                    filesUploader.push(this.rest.uploadFiles(request));
                    index++;
                    handler();
                  }).catch((err) => {
                    obs.error(err);
                  })
              }, err => {
                obs.error(err);
              });
            }).catch(err => {
              obs.error(err);
            });
        }
      };
      handler();
    });
  }


  private downloadForms(lastSyncDate: Date, result: DownloadData): Observable<Form[]> {
    return new Observable<any>(obs => {
      this.rest.getAllForms(lastSyncDate).subscribe((remoteForms) => {

        let current = new Date();

        remoteForms = remoteForms.filter(form => {
          form.id = form.form_id + "";
          if (new Date(form.archive_date) > current) return true;
          else console.log("Form " + form.name + "(" + form.id + ") is past it's expiration date. Filtering it out");
        });

        result.forms = remoteForms
        let localForms = this.formsProvider.getForms();
        remoteForms = this.checkFormData(remoteForms, localForms);
        this.clearLocalForms(localForms).subscribe(reply => {
          let localFormsIds = localForms.map((localForm) => parseInt(localForm.id));
          if (localFormsIds && localFormsIds.length > 0) {
            let remoteFormsIds = remoteForms.map((form) => form.form_id);
            result.newFormIds = remoteFormsIds.filter(x => localFormsIds.indexOf(x) == -1);
          }
          this.formsProvider.saveNewForms(remoteForms);
          obs.next(remoteForms);
          obs.complete();
        }, (err) => {
          obs.error(err);
        })

      }, err => {
        obs.error(err);
      });
    })
  }

  // A.S download all images for all forms
  private async downloadFormsData(forms: Form[]) {
    console.log('Downloading forms data...');
    await Promise.all(forms.map(async (form: Form) => {
      await this.downloadFormData(form);
      return form;
    }))
    this.hasNewData = false;
    console.log('Downloading forms data finished');
  }

  private async downloadFormData(form: Form) {
    await this.downloadFormBackground(form);
    await this.downloadFormScreenSaver(form);
  }

  private async downloadFormScreenSaver(form: Form) {
    if (form.event_style.screensaver_media_items) {
      let entry: Entry;
      this.formsProvider.updateFormSyncStatus(form.form_id, true)
      form.event_style.screensaver_media_items = await Promise.all(form.event_style.screensaver_media_items.map(async (item) => {
        if (item.url != '' && item.path.startsWith('https://')) {
          try {
            let file = this.util.getFilePath(item.path, `screen_saver_${form.form_id}_`);
            entry = await this.downloadFile(file.pathToDownload, file.path);
            item = { path: entry.nativeURL, url: item.url };
          } catch (error) {
            console.log('Error downloading a form screen saver image', error)
          }
        }
        return item;
      }))
      this.formsProvider.updateFormScreenSaver(form.form_id, form.event_style.screensaver_media_items);
      this.formsProvider.updateFormSyncStatus(form.form_id, false)
    }
  }

  private async downloadFormBackground(form: Form) {
    if (form.event_style.event_record_background.url != '' && form.event_style.event_record_background.path.startsWith('https://')) {
      let entry: Entry;
      this.formsProvider.updateFormSyncStatus(form.form_id, true)
      try {
        let file = this.util.getFilePath(form.event_style.event_record_background.url, `background_${form.form_id}_`);
        entry = await this.downloadFile(file.pathToDownload, file.path);
        form.event_style.event_record_background = { path: entry.nativeURL, url: form.event_style.event_record_background.url };
      } catch (error) {
        console.log('Error downloading a form background image', error)
      }
      this.formsProvider.updateFormBackground(form.form_id, form.event_style.event_record_background);
      this.formsProvider.updateFormSyncStatus(form.form_id, false)
    }
  }

  // A.S GOC-326 download form images
  private async downloadFile(pathToDownload: string, path: string) {
    return this.http.downloadFile(pathToDownload, {}, {}, path)
  }

  public downloadFileWithPath(path) {
    let file = this.util.getFilePath(path, '');
    return this.downloadFile(file.pathToDownload, file.path);
  }

  // A.S GOC-326 check file if downloaded
  checkFile(newUrl: string, oldUrl: Image, id: string) {
    let i = id.split('_'), fileCongif;
    if (!oldUrl) {
      console.log(`form ${i[2] || i[1]} has new ${i[0]}`);
      this.hasNewData = true;
      return newUrl;
    }
    else if (newUrl != oldUrl.url) {
      console.log(`form ${i[2] || i[1]} has updated ${i[0]}`);
      this.hasNewData = true;
      fileCongif = this.util.getFilePath(oldUrl.url, id);
      this.util.rmFile(fileCongif.folder, fileCongif.name)
      return newUrl;
    } else if (oldUrl.path.startsWith('https://')) {
      console.log(`form ${i[2] || i[1]} will download again ${i[0]}`);
      this.hasNewData = true;
      return oldUrl.path;
    } else {
      fileCongif = this.util.getFilePath(oldUrl.url, id);
      return fileCongif.path;
    }
  }


  // A.S GOC-326 check form data if downloaded
  private checkFormData(newForms: any[], oldForms: Form[]) {
    return newForms.map((form) => {
      let oldForm = oldForms.find(f => f.form_id == form.form_id);
      let img = form.event_style.event_record_background;
      form.event_style.event_record_background = { path: this.checkFile(img, oldForm && oldForm.event_style ? oldForm.event_style.event_record_background : null, `background_${form.form_id}_`), url: img };
      if (form.event_style.screensaver_media_items.length) {
        let oldImgs = oldForm && oldForm.event_style ? oldForm.event_style.screensaver_media_items : [];
        form.event_style.screensaver_media_items = form.event_style.screensaver_media_items.map((item) => {
          img = item;
          let oldImg = oldImgs.find((e) => e.url == img);
          item = { path: this.checkFile(img, oldImg, `screen_saver_${form.form_id}_`), url: img };
          return item;
        })
      }
      return form;
    })
  }


  private clearLocalForms(localForms): Observable<boolean> {
    return this.rest.getAvailableFormIds().flatMap(ids => {
      let toDelete = [];
      localForms.forEach(form => {
        if (ids.indexOf(parseInt(form.id)) == -1) {
          toDelete.push(form.id);
        }
      });
      return this.db.deleteFormsInList(toDelete);
    });
  }

  private downloadContacts(forms: Form[], result: DownloadData): Observable<any> {
    return new Observable<any>(obs => {
      this.rest.getAllDeviceFormMemberships(forms, result.newFormIds).subscribe((contacts) => {
        result.memberships.push.apply(result.memberships, contacts);
        this.db.saveMemberships(contacts).subscribe(res => {
          obs.next(null);
          obs.complete();
        }, err => {
          obs.error(err);
        });
      }, err => {
        obs.error(err);
      });
    });
  }


  private downloadSubmissions(forms: Form[], lastSyncDate: Date, result: DownloadData): Observable<any> {
    let allSubmissions: FormSubmission[] = [];
    return new Observable<any>(obs => {
      this.rest.getAllSubmissions(forms, null, result.newFormIds).subscribe(data => {
        this.db.getSubmissions(data.form.form_id, false).subscribe((oldSubs) => {
          let submissions = this.checkSubmissionsData(oldSubs, data.submissions, data.form)
          this.db.saveSubmisisons(submissions).subscribe(reply => {
            allSubmissions = [...allSubmissions, ...submissions];
            result.submissions = allSubmissions;
          }, err => {
            obs.error(err);
          });
          if(this.hasNewData) this.downloadSubmissionsData(data.form,submissions);
        })
      }, err => {
        obs.error(err);
      }, () => {
        obs.next(null);
        obs.complete();
      });
    });
  }

  private checkSubmissionsData(oldSubs: FormSubmission[], newSubs: FormSubmission[], form: Form): FormSubmission[] {
    let subDataFields: string[] = form.getUrlFields();
    return newSubs.map((sub) => {
      let oldSub = oldSubs.find((e) => e.id == sub.id);
      this.checkSubmissionFields(subDataFields,sub.fields,oldSub ? oldSub.fields : null,form,sub);
      return sub;
    })
  }

  private checkSubmissionFields(subDataFields,newSubData,oldSubData,form,sub){
    subDataFields.forEach((field) => {
      let sub1 = newSubData[field];
      let sub0 = oldSubData ? oldSubData[field] : null;
      if (sub1) {
        if (typeof (sub1) == "object") {
          Object.keys(sub1).map((key) => {
            sub1[key] = this.checkSubmissionFile(sub1[key], sub0 ? sub0[key] : null, `${form.form_id}_submission_${sub.id}_`)
          });
        }
        else if (Array.isArray(sub1)) {
          sub1 = sub1.map((e, i) => {
            return this.checkSubmissionFile(e, sub0 ? sub0[i] : null, `${form.form_id}_submission_${sub.id}_`)
          })
        }
        else {
          sub1 = this.checkSubmissionFile(sub1, sub0, `${form.form_id}_submission_${sub.id}_`)
        }
      }
    })
  }


  private checkSubmissionFile(newUrl, oldUrl, id): string {
    let i = id.split('_'), newFileCongif = this.util.getFilePath(newUrl, id), oldFileCongif = this.util.getFilePath(oldUrl || '');
    this.hasNewData = false;
    if (oldUrl && oldUrl.startsWith('https://')) {
      console.log(oldUrl)
      console.log(`submission ${i[2]} of form ${i[0]} will download data...`);
      this.hasNewData = true;
      return newUrl;
    }
    else if (oldFileCongif.name != newFileCongif.name) {
      console.log(`submission ${i[2]} of form ${i[0]} will download updated data`);
      this.util.rmFile(oldFileCongif.folder, oldFileCongif.name)
      this.hasNewData = true
      return newUrl;
    } else {
      console.log(`submission ${i[2]} of form ${i[0]} already downloaded data `);
      return newFileCongif.path;
    }
  }

  private async downloadSubmissionsData(form: Form, submissions: FormSubmission[]) {
    this.formsProvider.updateFormSyncStatus(form.form_id, true)
    let subDataFields: string[] = form.getUrlFields();
     submissions = await Promise.all(submissions.map( async (sub) => {
        await Promise.all( subDataFields.map( async (field) => {
          sub.fields[field] = await this.downloadSubmissionFields(sub.fields[field],form.form_id,sub.id)
        }))
        return sub;
      }) )
      console.log(`finished downloading submissions data of form ${form.form_id}`)
      this.db.saveSubmisisons(submissions).subscribe((data)=>{
        // console.log(submissions)
        this.formsProvider.updateFormSyncStatus(form.form_id, false)
      })
  }

  private async downloadSubmissionFields(sub1,formId,subId){
    if (sub1) {
      if (typeof (sub1) == "object") {
      return await Promise.all(Object.keys(sub1).map( async (key) => {
          return await this.getDownloadedFilePath(sub1[key], `${formId}_submission_${subId}_`)
        }));
      }
      else if (Array.isArray(sub1)) {
      return await Promise.all(sub1.map(async (e) => {
          return await this.getDownloadedFilePath(e, `${formId}_submission_${subId}_`)
        }))
      }
      else {
       return await this.getDownloadedFilePath(sub1, `${formId}_submission_${subId}_`)
      }
    }
  }

  private async getDownloadedFilePath(fileToDownload,id){
    let entry: Entry;
    try {
      let file = this.util.getFilePath(fileToDownload, id);
      entry = await this.downloadFile(file.pathToDownload, file.path);
      return entry.nativeURL;
    } catch (error) {
      console.log('Error downloading submission data', error)
      return fileToDownload;
    }
  }

}

export class DownloadData {
  forms: Form[] = [];
  memberships: DeviceFormMembership[] = [];
  submissions: FormSubmission[] = [];
  newFormIds: number[] = [];
}

class FormMapEntry {
  form: Form;
  urlFields: string[];
  status: SyncStatus;
  submissions: FormSubmission[];
}
