import { SettingsService } from './../../services/settings-service';
import { SubmissionsRepository } from './../../services/submissions-repository';
import { HTTP } from '@ionic-native/http';
import { Util } from './../../util/util';
import { RESTClient } from './../../services/rest-client';
import { FormsProvider } from './../forms/forms';
import { FormMapEntry, formSyncStatus } from './../../services/sync-client';
import { DBClient } from './../../services/db-client';
import { Observable, Observer, BehaviorSubject, Subject } from 'rxjs';
import { FormSubmission, BarcodeStatus, SubmissionStatus } from './../../model/form-submission';
import { Injectable } from '@angular/core';
import { Entry, File } from '@ionic-native/file';
import { Form } from '../../model/form';
import { FormElementType, SyncStatus } from '../../model';
import { settingsKeys } from '../../constants/constants';
import { FileUploadRequest } from '../../model/protocol';
import { mergeMap } from 'rxjs/operators';
import { FileTransfer } from '@ionic-native/file-transfer';


@Injectable()
export class SubmissionsProvider {

  submissions: FormSubmission[] = [];
  submissionsObs: Subject<any> = new Subject();
  /**
   * Duplicate lead event
   */
  private duplicateLeadSource: BehaviorSubject<any>;
  duplicateLead: Observable<any>;


  private downloadingSubmissions: any[] = [];
  private uploadingSubmissions: any[] = [];

  private hasNewData: boolean;

  constructor(
    private dbClient: DBClient,
    private http: HTTP,
    private formsProvider: FormsProvider,
    private rest: RESTClient,
    private submissionsRepository: SubmissionsRepository,
    private settingsService: SettingsService,
    private file: File,
    private util: Util) {
    this.duplicateLeadSource = new BehaviorSubject<any>(null);
    this.duplicateLead = this.duplicateLeadSource.asObservable();

  }

  getSubmissions(formId: number) {
    return new Observable<FormSubmission[]>((obs) => {
      this.dbClient.getSubmissions(formId, false).subscribe((data) => {
        this.submissions = data;
        this.submissions = this.submissions.map((e) => {
          this.setSubmissionSyncStatus(e.id)
          return e;
        })
        obs.next(data);
      })
    })
  }

  private setSubmissionSyncStatus(submissionId: number) {
    let sub = this.submissions.find((submission) => submission.id == submissionId);
    if (sub) {
      sub.isDownloading = this.checkSubmissionByType(submissionId, 'downloading')
      sub.isUploading = this.checkSubmissionByType(submissionId, 'uploading')
    }
  }

  setSubmissionAs(id, type: 'uploading' | 'downloading') {
    this[type + 'Submissions'].push(id);
  }

  rmSubmissionFrom(id, type: 'uploading' | 'downloading') {
    this[type + 'Submissions'] = this[type + 'Submissions'].filter((e) => e.id != id);
  }

  private checkSubmissionByType(id: number, type: 'uploading' | 'downloading') {
    return this[type + 'Submissions'].find((e) => e.id == id) ? true : false
  }

  downloadSubmissions(currentSyncingForms : formSyncStatus[]): Observable<any> {
    console.log('Getting latest submissions...')
    // this.formsProvider.setFormsSyncStatus(true);
    return new Observable<any>(obs => {
      this.rest.getAllSubmissions(this.formsProvider.forms).pipe(
        mergeMap(async (e) => {
          let data = {...e};
          await this.saveSubmissions(data)
          return data.form;
          })
      ).subscribe((data) => {
        obs.next(data.form_id);
      }, err => {
        obs.error(err);
      }, () => {
        obs.complete();
      });
    });
  }

  async saveSubmissions(data) {
    if(data.form) {
    // this.formsProvider.updateFormSyncStatus(data.form.form_id, true)
    let oldSubs = await this.dbClient.getSubmissions(data.form.form_id, false).toPromise(),
      submissionsToDownload: number[] = [],
      submissions = this.checkSubmissionsData(oldSubs, data.submissions, data.form, submissionsToDownload);
    this.dbClient.saveSubmisisons(submissions).subscribe(() => { }, () => { }, () => this.formsProvider.updateFormSubmissions(data.form.form_id))
    submissions = submissions.filter((s) => submissionsToDownload.findIndex((e) => e == s.id) != -1)
    if (submissionsToDownload.length) {
      try {
        await this.downloadSubmissionsData(data.form, submissions);
      } catch (error) {
        console.log(error);
      }
    }
      this.formsProvider.updateFormLastSync(data.form.form_id, 'submissions')
    }
    // console.log(`finished saving downloaded submissions data of form ${data.form.form_id}`)
  }

  private checkSubmissionsData(oldSubs: FormSubmission[], newSubs: FormSubmission[], form: Form, submissionsToDownload): FormSubmission[] {
    let subDataFields: string[] = form.getUrlFields();
    return newSubs.map((sub) => {
      let oldSub = oldSubs.find((e) => e.id == sub.id);
      this.checkSubmissionFields(subDataFields, sub.fields, oldSub ? oldSub.fields : null, form, sub, submissionsToDownload);
      return sub;
    })
  }

  private checkSubmissionFields(subDataFields, newSubData, oldSubData, form: Form, sub: FormSubmission, submissionsToDownload) {
    subDataFields.forEach((field) => {
      let sub1 = newSubData[field];
      let sub0 = oldSubData ? oldSubData[field] : null;
      if (sub1) {
        if (typeof (sub1) == "object") {
          Object.keys(sub1).map((key) => {
            sub1[key] = this.checkSubmissionFile(sub1[key], sub0 ? sub0[key] : null, `${form.form_id}_submission_${sub.id}_`, submissionsToDownload)
          });
        }
        else if (Array.isArray(sub1)) {
          sub1 = sub1.map((e, i) => {
            return this.checkSubmissionFile(e, sub0 ? sub0[i] : null, `${form.form_id}_submission_${sub.id}_`, submissionsToDownload)
          })
        }
        else {
          sub1 = this.checkSubmissionFile(sub1, sub0, `${form.form_id}_submission_${sub.id}_`, submissionsToDownload)
        }
      }
    })
  }


  private checkSubmissionFile(newUrl: string, oldUrl: string, id: string, submissionsToDownload: number[]): string {
    let i = id.split('_'),
      pathTodownload = newUrl,
      newFileCongif = this.util.getFilePath(newUrl, newUrl && newUrl.startsWith('https') ? id : ''),
      oldFileCongif = this.util.getFilePath(oldUrl);
    if (oldFileCongif.name === newFileCongif.name) {
      return oldUrl;
    } else {
      if (oldUrl && oldUrl.startsWith('file://')) {
        // console.log(`submission ${i[2]} of form ${i[0]} will download updated data...`);
        this.util.rmFile(oldFileCongif.folder, oldFileCongif.name);
      } else {
        // console.log(`submission ${i[2]} of form ${i[0]} will download data...`);
      }
      submissionsToDownload.push(parseInt(i[2]));
      return pathTodownload;
    }
  }

  private async downloadSubmissionsData(form: Form, submissions: FormSubmission[]) {
    // this.formsProvider.updateFormSyncStatus(form.form_id, true)
    let subDataFields: string[] = form.getUrlFields();
    submissions = await Promise.all(submissions.map(async (sub) => {
      this.setSubmissionAs(sub.id, 'downloading');
      await Promise.all(subDataFields.map(async (field) => {
        sub.fields[field] = await this.downloadSubmissionFields(sub.fields[field], form.form_id, sub.id)
      }))
      this.rmSubmissionFrom(sub.id, 'downloading');
      this.updateSubmission(sub);
      return sub;
    }))
    // console.log(submissions);
    this.dbClient.saveSubmisisons(submissions).subscribe();
    // this.formsProvider.updateFormSyncStatus(form.form_id, false)

  }


  private updateSubmission(submission: FormSubmission) {
    let Oldsubmission = this.submissions.find((e) => e.id == submission.id);
    if (Oldsubmission) Oldsubmission = submission;
  }


  private async downloadSubmissionFields(sub1, formId, subId) {
    if (sub1) {
      if (typeof (sub1) == "object") {
        await Promise.all(Object.keys(sub1).map(async (key) => {
          sub1[key] = await this.getDownloadedFilePath(sub1[key], `${formId}_submission_${subId}_`)
        }));
      }
      else if (Array.isArray(sub1)) {
        sub1 = await Promise.all(sub1.map(async (e) => {
          return await this.getDownloadedFilePath(e, `${formId}_submission_${subId}_`)
        }))
      }
      else {
        sub1 = await this.getDownloadedFilePath(sub1, `${formId}_submission_${subId}_`)
      }
      // console.log(sub1)
      return sub1;
    }
  }

  private async getDownloadedFilePath(fileToDownload: string, id: string) {
    let entry: Entry;
    const fileTransfer = new FileTransfer().create();
    // fileTransfer.onProgress((ev)=>{
    //   console.log(`${(ev.loaded/ev.total)*100}`);
    // });
    if (fileToDownload && fileToDownload.startsWith('https://')) {
      try {
        let file = this.util.getFilePath(fileToDownload, id);
        entry = await fileTransfer.download(file.pathToDownload, file.path, true);
        return entry.nativeURL;
      } catch (error) {
        // console.log('Error downloading submission data : ' + id.split('_').join(' ') + 'retrying later again...');
        // console.log(error);
        return fileToDownload;
      }
    }
    return fileToDownload;
  }

  public sync(submissions: FormSubmission[], forms: Form[]): Observable<FormSubmission[]> {
    return new Observable<FormSubmission[]>(obs => {
      let result = [];

      let map: { [key: number]: FormMapEntry } = {};

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
        obs.error(err);
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

  doSubmitAll(data: FormMapEntry): Observable<FormSubmission[]> {
    return new Observable<FormSubmission[]>((obs: Observer<FormSubmission[]>) => {
      let result = [];
      var index = 0;
      // console.log("Submit All");
      let handler = () => {

        if (index == data.submissions.length) {
          obs.next(result);
          obs.complete();
          return;
        }

        this.setSubmissionsUploading(data.submissions);
        this.doSubmit(data, index).subscribe((submission) => {
          console.log(submission)
          this.downloadSubmissionsData(data.form,[submission]).then();
          // A.S
          this.rmSubmissionFrom(submission.id, 'uploading')
          this.formsProvider.updateFormSubmissions(data.form.form_id);
          setTimeout(() => {
            result.push(submission);
            index++;
            handler();
          });

        }, (err) => {
          obs.error(err)
          index++;
          handler();
        });
      };
      handler();
    });
  }

  private doSubmit(data: FormMapEntry, index: number): Observable<FormSubmission> {

    return new Observable<FormSubmission>((obs: Observer<FormSubmission>) => {
      let submission = data.submissions[index];
      let urlMap: { [key: string]: string } = {};
      this.buildUrlMap(submission, data.urlFields, urlMap);

      // console.log("Do submit");

      let uploadUrlMap = {};
      Object.keys(urlMap).forEach((key) => {
        if (key.startsWith("file://") || key.startsWith("data:image") || key.startsWith("ms-appdata://")) {
          uploadUrlMap[key] = urlMap[key];
        }
      });

      let hasUrls = Object.keys(uploadUrlMap).length > 0;

      // console.log("Submission has urls - " + JSON.stringify(hasUrls));

      this.uploadData(uploadUrlMap, hasUrls).subscribe((uploadedData) => {

       // console.log("Submission uploaded data");

        this.updateUrlMapWithData(uploadUrlMap, uploadedData);

        Object.keys(uploadUrlMap).forEach((key) => {
          urlMap[key] = uploadUrlMap[key];
        });

        this.updateSubmissionFields(submission, data, urlMap);

        this.dbClient.updateSubmissionFields(data.form, submission).subscribe((done) => {
          console.log("Updated submission fields :");
          console.log(submission)
          if (submission.barcode_processed == BarcodeStatus.Queued && !submission.hold_submission) {
            this.processBarcode(data, submission, obs);
          } else if ((submission.barcode_processed == BarcodeStatus.Processed) && !submission.hold_submission && !this.isSubmissionValid(submission)) {
            this.processBarcode(data, submission, obs);
          } else {
            this.actuallySubmitForm(data.form, submission, obs);
          }
        }, (err) => {
          console.log(err);
          obs.error("Could not save updated submission for form " + data.form.name);
        });

      }, (err) => {
        console.log(err);
        obs.error("Could not process submission for form " + data.form.name);
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

        // console.log("Barcode data: " + JSON.stringify(barcodeData));

        submission.barcode_processed = BarcodeStatus.Processed;

        barcodeData.forEach(entry => {
          let id = data.form.getIdByUniqueFieldName(entry.ll_field_unique_identifier);
          if (!id) {
            return;
          }
          submission.fields[id] = entry.value;
        });

        this.dbClient.updateSubmissionFields(data.form, submission).subscribe((done) => {
          this.actuallySubmitForm(data.form, submission, obs, JSON.stringify(barcodeData));
        }, (err) => {
          console.log(err);
          obs.error("Could not save updated barcode info into the submission for form " + data.form.name);
        });
      }, (err) => {
        console.error(err);

        console.log('Process barcode error - ' + JSON.stringify(err));

        if (err && err.status == 400 && form.accept_invalid_barcode) {
          submission.hold_submission = 1;
          submission.hold_submission_reason = err.message ? err.message : "";
          submission.barcode_processed = BarcodeStatus.Processed;
          this.dbClient.updateSubmissionFields(data.form, submission).subscribe((done) => {
            this.actuallySubmitForm(data.form, submission, obs);
          });
        } else {
          console.log(err);
          obs.error("Could not process submission for form " + data.form.name + ": barcode processing failed");
        }
      });
  }

  private actuallySubmitForm(form: Form, submission: FormSubmission, obs: Observer<any>, barcodeData?: string) {

    console.log("Submit form to api: " + JSON.stringify(submission));
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
          submission.invalid_fields = 1;
          submission.hold_request_id = 0;
          submission.status = SubmissionStatus.InvalidFields;
          this.dbClient.updateSubmissionId(submission).subscribe((ok) => {
            console.log('invalid submission')
            console.log(submission);
          }, err => {
            console.log(err);
            obs.error("Could not process submission for form \"" + form.name + "\": " + d.message);
          });
          return;
        }

        if (d.is_new_submission == false) {
          this.dbClient.deleteSubmission(submission).subscribe();
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

        this.updateSubmissionStatus(submission.id, submission.status)

        this.submissionsRepository.handleMergedSubmission(d.id, submission, d.submission, form)
          .subscribe((ok) => {
            if (d.id > 0) {
              submission.id = submission.activity_id;
            }
            obs.next(submission);
            obs.complete();
          }, err => {
            console.log(err);
            obs.error("Could not process submission for form " + form.name);
          });
      }, err => {
        console.log(err);
        obs.error("Could not process submission for form " + form.name);
      })
    }, err => {
      console.log(err);
      obs.error("Could not process submission for form " + form.name);
    });

  }

  private isSubmissionValid(submission: FormSubmission) {
    return (submission.first_name.length > 0 && submission.last_name.length > 0) || submission.email.length > 0;
  }

  private uploadData(urlMap: { [key: string]: string }, hasUrls: boolean): Observable<any> {
    return new Observable<any>((obs: Observer<any>) => {

      //handle only those urls that were not uploaded before
      let urls = Object.keys(urlMap).filter(url => !url.startsWith("https://"));

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

          let file = urls[index].substr(urls[index].lastIndexOf("/") + 1);
          let folder = this.file.dataDirectory + 'leadliaison/' + this.util.folderForFile(`.${file.split('.')[1]}`).replace('/', '');
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

  private setSubmissionsUploading(submissions: FormSubmission[]) {
    submissions.forEach((e) => {
      this.setSubmissionAs(e.id, 'uploading')
    })
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

  updateSubmissionStatus(submissionId: number, status: SubmissionStatus) {
    let sub = this.submissions.find((e) => e.id == submissionId)
    if (sub) sub.status = status;
  }

  removeSubmission(submission) {
    this.dbClient.deleteSubmission(submission).subscribe(() => {
      this.submissions = this.submissions.filter((e) => e.id == submission.id);
    })
  }


}
