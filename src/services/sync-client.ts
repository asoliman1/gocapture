import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';
import {FileEntry, File} from '@ionic-native/file';
import {
  SyncStatus,
  BarcodeStatus,
  FormElementType,
  Form,
  Dispatch,
  DispatchOrder,
  DeviceFormMembership,
  FormSubmission,
  SubmissionStatus,
  FormSubmissionType
} from "../model";
import { FileUploadRequest, FileInfo } from "../model/protocol";
import { HTTP } from '@ionic-native/http';
declare var cordova: any;


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

  private _isSyncing: boolean = false;

  private lastSyncStatus: SyncStatus[];

  private dataUrlRegexp: RegExp = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

  constructor(private rest: RESTClient, private db: DBClient, private file: File, private http: HTTP) {
    this.errorSource = new BehaviorSubject<any>(null);
    this.error = this.errorSource.asObservable();
    this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
    this.onSync = this.syncSource.asObservable();
    this.entitySyncedSource = new BehaviorSubject<string>(null);
    this.entitySynced = this.entitySyncedSource.asObservable();

  }

  public isSyncing(): boolean {
    return this._isSyncing;
  }

  public getLastSync(): SyncStatus[] {
    return this.lastSyncStatus;
  }

  public download(lastSyncDate: Date, shouldDownloadAllContacts?: boolean): Observable<DownloadData> {
    return new Observable<DownloadData>((obs: Observer<DownloadData>) => {
      console.log("Should download all contacts " + shouldDownloadAllContacts);
      let result = new DownloadData();
      var map: { [key: string]: SyncStatus } = {
        forms: new SyncStatus(true, false, 0, "Forms", 10),
        contacts: new SyncStatus(false, false, 0, "Contacts", 0),
        dispatches: new SyncStatus(false, false, 0, "Dispatches", 0),
        submissions: new SyncStatus(false, false, 0, "Submissions", 0)
      };
      this._isSyncing = true;
      this.lastSyncStatus = [
        map["forms"],
        map["contacts"],
        map["dispatches"],
        map["submissions"]
      ];
      this.syncSource.next(this.lastSyncStatus);

      this.downloadForms(lastSyncDate, map, result).subscribe((forms) => {
        obs.next(result);
        this.db.getForms().subscribe(forms => {
          let filteredForms = [];
          let current = new Date();
          forms.forEach(form => {
            if (new Date(form.archive_date) > current) {
              filteredForms.push(form);
            } else {
              console.log("Form " + form.name + "(" + form.id + ") is past it's expiration date. Filtering it out");
            }
          });
          this.downloadSubmissions(filteredForms, lastSyncDate, map, result).subscribe(() => {
            obs.next(result);
            this.downloadDispatches(lastSyncDate, map, result).subscribe(() => {
              obs.next(result);
              console.log("Downloading contacts 1");

              let formsWithList = filteredForms.filter((form) => {
                return form.list_id > 0;
              });

              this.downloadContacts(formsWithList, map, result).subscribe(() => {

                formsWithList.forEach((form) => {
                  form.members_last_sync_date = new Date().toISOString().split(".")[0] + "+00:00";
                });

                this.db.saveForms(formsWithList).subscribe(result => {
                  //
                }, (err) => {
                  console.error(err);
                }, () => {
                  obs.next(result);
                  obs.complete();
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
        }, (err) => {
          this.syncCleanup();
        });
      }, (err) => {
        obs.error(err);
        this.syncCleanup();
      });
    });
  }

  private syncCleanup(){
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
        this.lastSyncStatus.push(map[form.form_id].status);
      });
      submissions.forEach(sub => {
        map[sub.form_id + ""].submissions.push(sub);
      });

      let formIds = Object.keys(map);
      let index = 0;
      map[formIds[index]].status.loading = true;
      this.syncSource.next(this.lastSyncStatus);

      let onError = (err) => {
        this._isSyncing = false;
        this.syncSource.complete();
        this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
        this.onSync = this.syncSource.asObservable();
        obs.error(err);
        this.errorSource.next(err);
      };

      let handler = (submitted: FormSubmission[]) => {
        result.push.apply(result, submitted);
        map[formIds[index]].status.complete = true;
        map[formIds[index]].status.loading = false;
        this.syncSource.next(this.lastSyncStatus);
        index++;
        if (index >= formIds.length) {
          this._isSyncing = false;
          obs.next(result);
          obs.complete();
          this.syncSource.complete();
          this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
          this.onSync = this.syncSource.asObservable();
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
              urlMap[url] = "";
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
      let hasUrls = this.buildUrlMap(submission, data.urlFields, urlMap);

      //update status to submitting
      submission.status = SubmissionStatus.Submitting;
      submission.last_sync_date = new Date().toISOString();
      this.db.updateSubmissionStatus(submission).subscribe();

      this.uploadImages(urlMap, hasUrls).subscribe((d) => {

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

        if (submission.barcode_processed == BarcodeStatus.Queued) {
          this.processBarcode(data, submission, obs);
        } else if ((submission.barcode_processed == BarcodeStatus.Processed) && !this.isSubmissionValid(submission)) {
          this.processBarcode(data, submission, obs);
        } else {
          this.actuallySubmitForm(data.form.name, submission, obs);
        }
      }, (err) => {
        obs.error(err);
        // let msg = "Could not process submission for form " + data.form.name;
        // this.errorSource.next(msg);
      });
    });
  }

  private processBarcode(data: FormMapEntry, submission, obs: Observer<FormSubmission>) {
    let identifier = data.form.getIdByFieldType(FormElementType.barcode);
    let form = data.form.getFieldByIdentifier(identifier);
    this.rest.fetchBarcodeData(<any>submission.fields[identifier], form.barcode_provider_id).subscribe(barcodeData => {
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
        this.actuallySubmitForm(data.form.name, submission, obs, JSON.stringify(barcodeData));
      }, (err) => {
        obs.error(err);
        this.errorSource.next("Could not save updated barcode info into the submission for form " + data.form.name);
      });
    }, (err) => {
      obs.error(err);
      let msg = "Could not process submission for form " + data.form.name + ": barcode processing failed";
      this.errorSource.next(msg);
    });
  }

  private actuallySubmitForm(formName: string, submission: FormSubmission, obs: Observer<any>, barcodeData?: string) {

    console.log("Submit form: " + JSON.stringify(submission));
    if (barcodeData) {
      console.log("With Barcode data: " + barcodeData);
    }

    if (submission.barcode_processed == BarcodeStatus.Processed) {
      submission.submission_type = FormSubmissionType.barcode;
    }

    if (submission.prospect_id) {
      submission.submission_type = FormSubmissionType.list;
    }

    this.rest.submitForm(submission).subscribe((d) => {

      if ((!d.id || d.id < 0) && (!d.hold_request_id || d.hold_request_id < 0)) {
        let msg = "Could not process submission for form \"" + formName + "\": " + d.message;
        submission.invalid_fields = 1;
        submission.activity_id = submission.id;
        submission.hold_request_id = 0;
        this.db.updateSubmissionId(submission).subscribe((ok) => {
          obs.error(msg);
          this.errorSource.next(msg);
        }, err => {
          obs.error(err);
          let msg = "Could not process submission for form " + formName;
          this.errorSource.next(msg);
        });
        return;
      }
      if (d.id > 0) {
        submission.activity_id = d.id;
        submission.status = SubmissionStatus.Submitted;
      } else {
        submission.activity_id = submission.id;
        submission.hold_request_id = d.hold_request_id;
        submission.status = SubmissionStatus.OnHold;
      }

      this.db.updateSubmissionId(submission).subscribe((ok) => {
        if(d.id > 0){
          submission.id = submission.activity_id;
        }
        obs.next(submission);
        obs.complete();
      }, err => {
        obs.error(err);
        let msg = "Could not process submission for form " + formName;
        this.errorSource.next(msg);
      })
    }, err => {
      obs.error(err);
      let msg = "Could not process submission for form " + formName;
      this.errorSource.next(msg);
    });
  }

  private isSubmissionValid(submission: FormSubmission) {
    return (submission.first_name.length > 0 && submission.last_name.length > 0) || submission.email.length > 0;
  }

  private uploadImages(urlMap: { [key: string]: string }, hasUrls: boolean): Observable<any> {
    return new Observable<any>((obs: Observer<any>) => {
      if (!hasUrls) {
        obs.next(null);
        obs.complete();
        return;
      }
      let index = 0;
      let urls = Object.keys(urlMap);

      let filesUploader = [];

      let handler = () => {
        let request = new FileUploadRequest();
        if (index >= urls.length) {
          Observable.zip(...filesUploader).subscribe((data) => {
            urls.forEach((url, index) => {
              let dataFile = data[index];
              urlMap[url] = dataFile[0]['url'];
            });
            obs.next(data);
            obs.complete();
          }, err => {
            obs.error(err);
          })
        } else {
          if (this.dataUrlRegexp.test(urls[index])) {
            let data = urls[index];
            let entry = this.createFile(data, "sig" + new Date().getTime(), 0);
            request.files.push(entry);
            filesUploader.push(this.rest.uploadFiles(request));
            index++;
            handler();
            return;
          }
          let folder = urls[index].substr(0, urls[index].lastIndexOf("/"));
          let file = urls[index].substr(urls[index].lastIndexOf("/") + 1);
          this.file.resolveDirectoryUrl(folder).then(dir => {
            this.file.getFile(dir, file, { create: false }).then(fileEntry => {
              fileEntry.getMetadata((metadata) => {
                //data:[<mediatype>][;base64],<data>
                this.file.readAsDataURL(folder, file).then((data: string) => {
                  let entry = this.createFile(data, file, metadata.size);
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
          }).catch(err => {
            obs.error(err);
          });
        }
      };
      handler();
    });
  }

  private createFile(data, name, size) {
    let entry = new FileInfo();
    let d = data.split(";base64,");
    entry.data = d[1];
    entry.name = name;
    entry.size = size;

    if (entry.size == 0) {
      entry.size = atob(entry.data).length;
    }
    entry.mime_type = d[0].substr(5);
    return entry;
  }

  private downloadForms(lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<Form[]> {
    return new Observable<any>(obs => {
      let mapEntry = map["forms"];
      mapEntry.loading = true;
      mapEntry.percent = 10;
      this.rest.getAvailableFormIds().subscribe(ids => {

        this.db.getForms().subscribe(forms => {
          let toDelete = [];
          let newForms = [];
          forms.forEach(form => {
            if(ids.indexOf(form.form_id) == -1){
              toDelete.push(form.form_id);
            }
          });
          ids.forEach((id) => {
            let form = forms.find((f) => {
              return f.form_id == id;
            });
            if(!form){
              newForms.push(id);
            }
          });
          result.newFormIds = newForms;
          this.db.deleteFormsInList(toDelete).subscribe(() => {
            this.rest.getAllForms(lastSyncDate).subscribe(forms => {
              result.forms = forms;
              forms.forEach((form) => {
                form.id = form.form_id + "";
              });
              mapEntry.percent = 50;
              this.syncSource.next(this.lastSyncStatus);
              this.db.saveForms(forms).subscribe(reply => {
                mapEntry.complete = true;
                mapEntry.loading = false;
                mapEntry.percent = 100;
                this.entitySyncedSource.next(mapEntry.formName);
                this.syncSource.next(this.lastSyncStatus);
                obs.next(forms);
                obs.complete();
              }, err => {
                obs.error(err);
              });
            }, err => {
              obs.error(err);
            });
          });
        }, err => {
          obs.error(err);
        });
      }, err => {
        obs.error(err);
      });
    });
  }

  private downloadContacts(forms: Form[], map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
    return new Observable<any>(obs => {
      let mapEntry = map["contacts"];
      mapEntry.loading = true;
      mapEntry.percent = 10;
      console.log("Downloading contacts 2");
      this.rest.getAllDeviceFormMemberships(forms, result.newFormIds).subscribe((contacts) => {
        console.log("Downloading contacts 3");
        result.memberships.push.apply(result.memberships, contacts);
        mapEntry.percent = 50;
        this.syncSource.next(this.lastSyncStatus);
        this.db.saveMemberships(contacts).subscribe(res => {
          mapEntry.complete = true;
          mapEntry.loading = false;
          mapEntry.percent = 100;
          this.entitySyncedSource.next(mapEntry.formName);
          this.syncSource.next(this.lastSyncStatus);
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

  private downloadSubmissions(forms: Form[], lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
    return new Observable<any>(obs => {
      let mapEntry = map["submissions"];
      mapEntry.loading = true;
      mapEntry.percent = 10;
      this.rest.getAllSubmissions(forms, lastSyncDate, result.newFormIds).subscribe(submissions => {
        mapEntry.percent = 50;
        this.syncSource.next(this.lastSyncStatus);
        result.submissions = submissions;
        //let forms: Form[] = [];
        this.downloadImages(forms, submissions).subscribe(subs => {
          this.db.saveSubmisisons(subs).subscribe(reply => {
            mapEntry.complete = true;
            mapEntry.loading = false;
            mapEntry.percent = 100;
            this.entitySyncedSource.next(mapEntry.formName);
            this.syncSource.next(this.lastSyncStatus);
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

  private downloadImages(forms: Form[], submissions: FormSubmission[]): Observable<FormSubmission[]> {
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
      var urls = Object.keys(urlMap);
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
          let ext = urls[index].substr(urls[index].lastIndexOf("."));
          let pathToDownload = encodeURI(urls[index]);
          let newFolder = this.file.dataDirectory + "leadliaison/images/";
          let newName = "dwn_" + new Date().getTime() + ext;
          let path = newFolder + newName;

          this.http.downloadFile(pathToDownload, {}, {}, path).then(entry => {
            urlMap[urls[index]] = "/" + entry.nativeURL.split("///")[1];
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
  dispatches: Dispatch[] = [];
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
