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
  Form,
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

  public download(lastSyncDate: Date, shouldDownloadAllContacts?: boolean): Observable<DownloadData> {
    return new Observable<DownloadData>((obs: Observer<DownloadData>) => {
      let result = new DownloadData();
      var map: { [key: string]: SyncStatus } = {
        forms: new SyncStatus(true, false, 0, "Forms", 10),
        contacts: new SyncStatus(false, false, 0, "Contacts", 0),
        submissions: new SyncStatus(false, false, 0, "Submissions", 0)
      };
      this._isSyncing = true;
      this.lastSyncStatus = [
        map["forms"],
        map["contacts"],
        map["submissions"]
      ];
      this.syncSource.next(this.lastSyncStatus);
      this.downloadForms(lastSyncDate, map, result).subscribe(async (forms) => {
        // A.S check if form has data to be downloaded
        if (this.hasNewData) {
          // A.S GOC-326
          forms = await this.downloadFormData(forms);
          this.hasNewData = false;
          console.log('Downloading finished')
          this.db.saveForms(forms).subscribe((data) => {
            this.entitySyncedSource.next("Forms") // A.S emit forms updates
          });
        }
        obs.next(result);

        console.log('Getting latest submissions...')
        this.downloadSubmissions(forms, lastSyncDate, map, result).subscribe(() => {
          obs.next(result);

          let formsWithList = forms.filter((form) => {
            return form.list_id > 0;
          });

          // console.log("Should download all contacts " + shouldDownloadAllContacts);
          console.log('Getting the latest contacts...')
          this.downloadContacts(formsWithList, map, result).subscribe(() => {
            formsWithList.forEach((form) => {
              form.members_last_sync_date = new Date().toISOString().split(".")[0] + "+00:00";
            });
            this.lastSyncStatus = [];
            this.db.saveForms(formsWithList).subscribe(result => {
              console.log('Getting latest docs...');
              this.documentsSync.syncAll().then(() => {
                this.syncCleanup();
                obs.complete();
                console.log('Data saved.');
              }).catch(err => {
                console.log(err);
                obs.error(err);
              });
              console.log(result);
            }, (err) => {
              console.error(err);
            }, () => {
              obs.next(result);
              this.syncCleanup();
            });

          }, (err) => {
            obs.error(err);
            this.syncCleanup();
          });
        }, (err) => {
          obs.error(err);
          this.syncCleanup();
        });
      }, (err) => {
        obs.error(err);
        this.syncCleanup();
      });
    });
  }



  // A.S function to push for updates in syncing process
  private setFormSync(form: Form, complete: boolean, percent: number) {
    let formStatus: SyncStatus = new SyncStatus(!complete, complete, form.form_id, form.name, percent);
    this.pushNewSyncStatus(formStatus);
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
      this.pushNewSyncStatus(map[formIds[index]].status)

      let onError = (err) => {
        this.syncCleanup();
        obs.error(err);
        this.errorSource.next(err);
      };

      let handler = (submitted: FormSubmission[]) => {
        result.push.apply(result, submitted);
        map[formIds[index]].status.complete = true;
        map[formIds[index]].status.loading = false;
        this.pushNewSyncStatus(map[formIds[index]].status)
        index++;
        if (index >= formIds.length) {
          obs.next(result);
          obs.complete();
          this.lastSyncStatus = [];
          this.syncCleanup()
          return;
        }
        setTimeout(() => {
          this.doSubmitAll(map[formIds[index]]).subscribe(handler, onError);
        }, 500);
      };

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


  private downloadForms(lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<Form[]> {
    return new Observable<any>(obs => {
      console.log('Getting latest forms...')

      let mapEntry = map["forms"];
      mapEntry.loading = true;
      mapEntry.percent = 10;

      this.pushNewSyncStatus(mapEntry);

      this.rest.getAllForms(lastSyncDate).subscribe((remoteForms) => {


        let remoteFormsIds = remoteForms.map((form) => form.form_id);
        let current = new Date();

        remoteForms = remoteForms.filter(form => {
          form.id = form.form_id + "";
          if (new Date(form.archive_date) > current) return true;
          else console.log("Form " + form.name + "(" + form.id + ") is past it's expiration date. Filtering it out");
        });

        result.forms = remoteForms
        this.db.getForms().subscribe(async (localForms) => {
          remoteForms = this.checkFormData(remoteForms, localForms);
          this.clearLocalForms(localForms).flatMap(() => {
            mapEntry.percent = 50;
            this.pushNewSyncStatus(mapEntry);
            return this.db.getForms();
          }).flatMap((localForms) => {

            let localFormsIds = localForms.map((localForm) => parseInt(localForm.id));
            if (localFormsIds && localFormsIds.length > 0) {
              result.newFormIds = remoteFormsIds.filter(x => localFormsIds.indexOf(x) == -1);
            }
            return this.db.saveForms(remoteForms);
          }).subscribe(reply => {
            mapEntry.complete = true;
            mapEntry.loading = false;
            mapEntry.percent = 100;
            this.entitySyncedSource.next(mapEntry.formName);
            this.pushNewSyncStatus(mapEntry);
            obs.next(remoteForms);
            obs.complete();
          }, (err) => {
            obs.error(err);
          })
        }, (err) => {
          obs.error(err);

        })
      }, err => {
        obs.error(err);
      });
    })
  }

  // A.S download all images for all forms
  private async downloadFormData(forms: Form[]) {
    let entry: Entry;
    console.log('Downloading forms data...');
    return await Promise.all(forms.map(async (form: Form) => {
      this.setFormSync(form, false, 10);
      if (form.event_style.event_record_background.url != '' && form.event_style.event_record_background.path.startsWith('https://')) {
        try {
          let file = this.util.getFilePath(form.event_style.event_record_background.url, `background_${form.form_id}_`);
          entry = await this.downloadFile(file.pathToDownload, file.path);
          form.event_style.event_record_background = { path: entry.nativeURL, url: form.event_style.event_record_background.url };
        } catch (error) {
          form.event_style.event_record_background = { path: form.event_style.event_record_background.url, url: form.event_style.event_record_background.url };          
          console.log('Error downloading a file',error)
        }
      }
      this.setFormSync(form, false, 50);
      if (form.event_style.screensaver_media_items) {
        form.event_style.screensaver_media_items = await Promise.all(form.event_style.screensaver_media_items.map(async (item) => {
          if (item.url != '' && item.path.startsWith('https://')) {
            try {
              let file = this.util.getFilePath(item.path, `screen_saver_${form.form_id}_`);
              entry = await this.downloadFile(file.pathToDownload, file.path);
              item = { path: entry.nativeURL, url: item.url };
            } catch (error) {
              item = { path: item.url, url: item.url };
              console.log('Error downloading a file',error)
            }
          }
          return item;
        }))
      }
      this.setFormSync(form, true, 100);
      return form;
    }))
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
      this.util.rmFile("images", fileCongif.name)
      return newUrl;
    } else if (oldUrl.path.startsWith('https://')) {
      console.log(`form ${i[2] || i[1]} will download again ${i[0]}`);
      this.hasNewData = true;
      return oldUrl.path;
    } else {
      // console.log(`form ${i[2] || i[1]} has a ${i[0]} `)
      // A.S for ios if the app updated , app's directory will change so we need to check app directory.
      fileCongif = this.util.getFilePath(oldUrl.url, id);
      return fileCongif.path;
    }
  }


  // A.S GOC-326 check form data if downloaded
  private checkFormData(newForms: any[], oldForms: Form[]) {
    return newForms.map((form) => {
      let oldForm = oldForms.filter(f => f.form_id == form.form_id)[0];
      let img = form.event_style.event_record_background;
      form.event_style.event_record_background = { path: this.checkFile(img, oldForm && oldForm.event_style ? oldForm.event_style.event_record_background : null, `background_${form.form_id}_`), url: img };
      if (form.event_style.screensaver_media_items.length) {
        let oldImgs = oldForm && oldForm.event_style ? oldForm.event_style.screensaver_media_items : [];
        form.event_style.screensaver_media_items = form.event_style.screensaver_media_items.map((item) => {
          img = item;
          let oldImg = oldImgs.filter((e) => e.url == img)[0];
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

  private downloadContacts(forms: Form[], map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
    return new Observable<any>(obs => {
      let mapEntry = map["contacts"];
      mapEntry.loading = true;
      mapEntry.percent = 10;
      this.pushNewSyncStatus(mapEntry);
      this.rest.getAllDeviceFormMemberships(forms, result.newFormIds).subscribe((contacts) => {
        result.memberships.push.apply(result.memberships, contacts);
        mapEntry.percent = 50;
        this.pushNewSyncStatus(mapEntry)
        this.db.saveMemberships(contacts).subscribe(res => {
          mapEntry.complete = true;
          mapEntry.loading = false;
          mapEntry.percent = 100;
          this.entitySyncedSource.next(mapEntry.formName);
          this.pushNewSyncStatus(mapEntry)
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

  // A.S fn to push any new status
  private pushNewSyncStatus(element: SyncStatus) {
    this.syncSource.next(this.lastSyncStatus);
    this.lastSyncStatus.push(element);
  }

  /*
  private downloadDispatches(lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
    return new Observable<any>(obs => {
      let mapEntry = map["dispatches"];
      mapEntry.loading = true;
      mapEntry.percent = 10;
      this.rest.getAllDispatches(lastSyncDate).subscribe(dispatches => {
        mapEntry.percent = 50;
        this.syncSource.next(this.lastSyncStatus);
        result.dispatches = dispatches;
        let orders: DispatchOrder[] = [];
        let forms: Form[] = [];
        this.syncSource.next(this.lastSyncStatus);
        dispatches.forEach(dispatch => {
          orders.push.apply(orders, dispatch.orders);
          dispatch.forms.forEach(f => {
            if (forms.filter((form) => { return form.form_id == f.form_id }).length == 0) {
              forms.push(f);
            }
          });
        });
        orders.forEach(order => {
          order.form = forms.filter(f => { return f.form_id == order.form_id })[0];
          order.id = order.id + "" + order.form_id;
        });
        mapEntry.percent = 100;
        this.syncSource.next(this.lastSyncStatus);
        this.db.saveDispatches(orders).subscribe(reply => {
          mapEntry.complete = true;
          mapEntry.loading = false;
          mapEntry.percent = 100;
          this.entitySyncedSource.next(mapEntry.formName);
          this.syncSource.next(this.lastSyncStatus);
          obs.next(null);
          obs.complete();
        });
      }, err => {
        obs.error(err);
      });
    });
  }
   */

  private downloadSubmissions(forms: Form[], lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
    return new Observable<any>(obs => {
      let mapEntry = map["submissions"];
      mapEntry.loading = true;
      mapEntry.percent = 10;

      this.pushNewSyncStatus(mapEntry);

      this.rest.getAllSubmissions(forms, lastSyncDate, result.newFormIds).subscribe(submissions => {
        mapEntry.percent = 50;
        this.pushNewSyncStatus(mapEntry);
        result.submissions = submissions;
        this.downloadData(forms, submissions).subscribe(subs => {
          this.db.saveSubmisisons(subs).subscribe(reply => {
            mapEntry.complete = true;
            mapEntry.loading = false;
            mapEntry.percent = 100;
            this.entitySyncedSource.next(mapEntry.formName);
            this.pushNewSyncStatus(mapEntry);
            obs.next(null);
            obs.complete();
          }, err => {
            obs.error(err);
          });
        }, err => {
          obs.error(err);
        });
      }, err => {
        obs.error(err);
      });
    });
  }

  private downloadData(forms: Form[], submissions: FormSubmission[]): Observable<FormSubmission[]> {
    return new Observable<FormSubmission[]>((obs: Observer<FormSubmission[]>) => {
      if (!submissions || submissions.length == 0) {
        obs.next([]);
        obs.complete();
        return;
      }
      let map: { [key: string]: Form } = forms.reduce((previous, current, index, array) => {
        previous[current.id] = current;
        return previous;
      }, {});

      let urlMap: { [key: string]: string } = {};
      let hasUrls = false;
      submissions.forEach((submission) => {
        let urlFields = map[submission.form_id].getUrlFields();
        hasUrls = this.buildUrlMap(submission, urlFields, urlMap) || hasUrls;
      });
      if (!hasUrls) {
        obs.next(submissions);
        obs.complete();
        return;
      }
      var urls = Object.keys(urlMap).filter((url) => { return url.startsWith("https://") });
      let index = 0;
      let handler = () => {
        if (index == urls.length) {
          submissions.forEach(submission => {
            let urlFields = map[submission.form_id].getUrlFields();
            for (var field in submission.fields) {
              if (urlFields.indexOf(field) > -1) {
                let sub = submission.fields[field];
                if (sub) {
                  if (typeof (sub) == "object") {
                    Object.keys(sub).forEach((key) => {
                      sub[key] = urlMap[sub[key]];
                    });
                  } else if (Array.isArray(sub)) {
                    let val = <string[]>submission.fields[field];
                    for (let i = 0; i < val.length; i++) {
                      val[i] = urlMap[val[i]];
                    }
                  } else {
                    submission.fields[field] = urlMap[sub];
                  }
                }
              }
            }
          });
          obs.next(submissions);
          obs.complete();
        } else {
          // A.S
          let file = this.util.getFilePath(urls[index], '');

          this.http.downloadFile(file.pathToDownload, {}, {}, file.path).then(entry => {
            urlMap[urls[index]] = urls[index];
            index++;
            setTimeout(() => {
              handler();
            });
          }).catch((err) => {
            console.error(err);
            index++;
            setTimeout(() => {
              handler();
            });
          });
        }
      };
      handler();
    });
  }

  private isExternalUrl(url: string) {
    return url.indexOf("http") == 0;
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
