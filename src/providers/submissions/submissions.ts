import { HTTP } from '@ionic-native/http';
import { Util } from './../../util/util';
import { RESTClient } from './../../services/rest-client';
import { FormsProvider } from './../forms/forms';
import { DownloadData } from './../../services/sync-client';
import { DBClient } from './../../services/db-client';
import { Observable } from 'rxjs';
import { FormSubmission } from './../../model/form-submission';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Entry } from '@ionic-native/file';
import { Form } from '../../model/form';


@Injectable()
export class SubmissionsProvider {

  submissions : FormSubmission[] = [];
  submissionsObs : Subject <any> = new Subject();

  private downloadingSubmissions : any[] = [];
  private uploadingSubmissions : any[] = [];

  private hasNewData : boolean;

  constructor(
    private dbClient : DBClient,
    private http : HTTP,
    private formsProvider : FormsProvider,
    private rest : RESTClient,
    private util : Util) {
  }

  getSubmissions(formId:number){
    return new Observable <FormSubmission[]> ((obs)=>{
      this.dbClient.getSubmissions(formId,false).subscribe((data)=>{
        this.submissions = data;
        this.submissions = this.submissions.map((e)=>{
          this.setSubmissionSyncStatus(e.id)
          return e;
        })
        obs.next(this.submissions);
      })
    })
  }

  private setSubmissionSyncStatus(submissionId : number){
    let sub = this.submissions.find((submission)=> submission.id == submissionId);
    if(sub){
     sub.isDownloading = this.checkSubmissionByType(submissionId,'downloading')
     sub.isUploading = this.checkSubmissionByType(submissionId,'uploading')
    }
  }

   setSubmissionAs(id,type : 'uploading' | 'downloading'){
    this[type+'Submissions'].push(id);
  }

   rmSubmissionFrom(id,type : 'uploading' | 'downloading'){
    this[type+'Submissions'] = this[type+'Submissions'].filter((e)=> e.id != id);
  }

  private checkSubmissionByType(id : number ,type : 'uploading' | 'downloading'){
   return this[type+'Submissions'].find((e)=> e.id == id) ? true : false
  }

   downloadSubmissions(forms: Form[], lastSyncDate: Date, result: DownloadData): Observable<any> {
    let allSubmissions: FormSubmission[] = [];
    return new Observable<any>(obs => {
      this.updateFormsSyncStatus(forms)
      this.rest.getAllSubmissions(forms, null, result.newFormIds).subscribe(data => { // lastSyncDate
        this.dbClient.getSubmissions(data.form.form_id, false).subscribe((oldSubs) => {
          let submissions = this.checkSubmissionsData(oldSubs, data.submissions, data.form)
          this.dbClient.saveSubmisisons(submissions).subscribe(reply => {
            allSubmissions = [...allSubmissions, ...submissions];
            result.submissions = allSubmissions;
            this.formsProvider.updateFormSyncStatus(data.form.form_id,false)
          }, err => {
            this.formsProvider.updateFormSyncStatus(data.form.form_id,false)
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

  updateFormsSyncStatus(forms : Form[]){
    forms.forEach((e)=>{
      this.formsProvider.updateFormSyncStatus(e.form_id,true)
    })
  }

  private checkSubmissionsData(oldSubs: FormSubmission[], newSubs: FormSubmission[], form: Form): FormSubmission[] {
    let subDataFields: string[] = form.getUrlFields();
    return newSubs.map((sub) => {
      let oldSub = oldSubs.find((e) => e.id == sub.id);
      this.checkSubmissionFields(subDataFields,sub.fields,oldSub ? oldSub.fields : null,form,sub);
      return sub;
    })
  }

  private checkSubmissionFields(subDataFields,newSubData,oldSubData,form : Form ,sub : FormSubmission){
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


  private checkSubmissionFile(newUrl : string, oldUrl : string, id : string): string {
    let i = id.split('_'), newFileCongif = this.util.getFilePath(newUrl, id), oldFileCongif = this.util.getFilePath(oldUrl || '');
    this.hasNewData = false;
    if (oldUrl && oldUrl.startsWith('https://')) {
      console.log(`submission ${i[2]} of form ${i[0]} will download data...`);
      this.hasNewData = true;
      return newUrl;
    }
    else if (oldFileCongif.name != newFileCongif.name) {
      console.log(`submission ${i[2]} of form ${i[0]} will download updated data`);
      if(oldUrl && oldUrl.startsWith('file://')) this.util.rmFile(oldFileCongif.folder, oldFileCongif.name)
      this.hasNewData = true
      return newUrl;
    } else {
      // console.log(`submission ${i[2]} of form ${i[0]} already downloaded data `);
      return newFileCongif.path;
    }
  }

  private async downloadSubmissionsData(form: Form, submissions: FormSubmission[]) {
    this.formsProvider.updateFormSyncStatus(form.form_id, true)
    let subDataFields: string[] = form.getUrlFields();
     submissions = await Promise.all(submissions.map( async (sub) => {
        this.setSubmissionAs(sub.id,'downloading');
        await Promise.all( subDataFields.map( async (field) => {
          sub.fields[field] = await this.downloadSubmissionFields(sub.fields[field],form.form_id,sub.id)
        }))
        this.rmSubmissionFrom(sub.id,'downloading');
        return sub;
      }) )
   

      this.dbClient.saveSubmisisons(submissions).subscribe((data)=>{
        console.log(`finished saving downloading submissions data of form ${form.form_id}`)
        this.formsProvider.updateFormSyncStatus(form.form_id, false)
      })
  }



  private async downloadSubmissionFields(sub1,formId,subId){
    if (sub1) {
      if (typeof (sub1) == "object") {
       await Promise.all(Object.keys(sub1).map( async (key) => {
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
      return sub1;
    }
  }

  private async getDownloadedFilePath(fileToDownload : string,id : string){
    let entry: Entry;
    try {
      if(fileToDownload.startsWith('http')){
        let file = this.util.getFilePath(fileToDownload, id);
        entry = await this.http.downloadFile(file.pathToDownload, {} ,{} , file.path);
        return entry.nativeURL;
      }
      return fileToDownload;
    } catch (error) {
      console.log('Error downloading submission data', error)
      return fileToDownload;
    }
  }

}
