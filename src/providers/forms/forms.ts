import { HTTP } from '@ionic-native/http';
import { Image } from '../../model/image';
import { Form } from '../../model/form';
import { Injectable } from '@angular/core';
import { SubmissionStatus } from '../../model';
import { Subject, Observable } from 'rxjs';
import { merge } from 'lodash';
import { Entry } from '@ionic-native/file';
import { RESTClient } from './../../services/rest-client';
import { DBClient } from './../../services/db-client';
import { Util } from './../../util/util';
import { DownloadData } from './../../services/sync-client';

@Injectable()
export class FormsProvider {

  forms: Form[] = [];
  loaded: boolean = false;
  formsObs : Subject<any> = new Subject();
  hasNewData : boolean;

  constructor(
    private dbClient: DBClient,
    private util : Util, 
    private http : HTTP,
    private rest : RESTClient,

    ) {
    console.log('Forms Provider started')
    this.setForms()
  }

  setForms() {
    if (!this.loaded && this.dbClient.isWorkDbInited()){
      this.loaded = true;
      this.dbClient.getForms().subscribe((forms) => {
        forms = forms.map((e)=>{
          e.isSyncing = true; 
          return e;
        });
        this.forms = forms;
        this.pushUpdates();
      })
    }
   
  }

   downloadForms(lastSyncDate: Date, result: DownloadData): Observable<Form[]> {
    return new Observable<any>(obs => {
      this.rest.getAllForms(lastSyncDate).subscribe((remoteForms) => {

        let current = new Date();

        remoteForms = remoteForms.filter(form => {
          form.id = form.form_id + "";
          if (new Date(form.archive_date) > current) return true;
          else console.log("Form " + form.name + "(" + form.id + ") is past it's expiration date. Filtering it out");
        });

        result.forms = remoteForms
        let localForms = this.getForms();
        remoteForms = this.checkFormData(remoteForms, localForms);
        this.clearLocalForms(localForms).subscribe(reply => {
          let localFormsIds = localForms.map((localForm) => parseInt(localForm.id));
          if (localFormsIds && localFormsIds.length > 0) {
            let remoteFormsIds = remoteForms.map((form) => form.form_id);
            result.newFormIds = remoteFormsIds.filter(x => localFormsIds.indexOf(x) == -1);
          }
          this.saveNewForms(remoteForms);
             // A.S check if form has data to be downloaded
          if (this.hasNewData) {
            // A.S GOC-326
            this.downloadFormsData(remoteForms);
          }
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
      this.updateFormSyncStatus(form.form_id, true)
      form.event_style.screensaver_media_items = await Promise.all(form.event_style.screensaver_media_items.map(async (item) => {
        if (item.url != '' && item.path.startsWith('https://')) {
          try {
            let file = this.util.getFilePath(item.path, `screen_saver_${form.form_id}_`);
            entry = await this.http.downloadFile(file.pathToDownload,{},{}, file.path);
            item = { path: entry.nativeURL, url: item.url };
          } catch (error) {
            console.log('Error downloading a form screen saver image', error)
          }
        }
        return item;
      }))
      this.updateFormScreenSaver(form.form_id, form.event_style.screensaver_media_items);
      this.updateFormSyncStatus(form.form_id, false)
    }
  }

  private async downloadFormBackground(form: Form) {
    if (form.event_style.event_record_background.url != '' && form.event_style.event_record_background.path.startsWith('https://')) {
      let entry: Entry;
      this.updateFormSyncStatus(form.form_id, true)
      try {
        let file = this.util.getFilePath(form.event_style.event_record_background.url, `background_${form.form_id}_`);
        entry = await this.http.downloadFile(file.pathToDownload,{},{}, file.path);
        form.event_style.event_record_background = { path: entry.nativeURL, url: form.event_style.event_record_background.url };
      } catch (error) {
        console.log('Error downloading a form background image', error)
      }
      this.updateFormBackground(form.form_id, form.event_style.event_record_background);
      this.updateFormSyncStatus(form.form_id, false)
    }
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
      return this.dbClient.deleteFormsInList(toDelete);
    });
  }

  resetForms(){
    this.forms = [];
  }

  getForms(): Form[] {
    return this.forms
  }

  saveNewForm(form: Form) {
    this.forms.push(form);
    this.updateFormSubmissions(form.form_id);
    this.pushUpdates();
  }

  saveFormDb(form: Form) {
    this.dbClient.saveForm(form).subscribe(res => { }, err => { });
  }

  saveNewForms(forms: Form[]) {
    
    forms.forEach((e : Form)=> {
      let form = this.forms.find((f)=>f.form_id == e.form_id);
      if(form) form = form;
      else {
        this.forms.push(e);
        form = e;
      }
      this.saveFormDb(form)
    });
    this.pushUpdates();
  }


  deleteForm(form: Form) {
    this.forms = this.forms.filter((e) => e.form_id !== form.form_id);
    this.pushUpdates();
  }


  updateFormSyncStatus(form_id: any, isSyncing: boolean) {
    let form = this.forms.find((e) => e.form_id == (form_id * 1));
    form.isSyncing = isSyncing;
    // this.saveFormDb(form)
    // this.pushUpdates()
    //  console.log(`form ${form_id} syncing status is ${isSyncing}`);
  }

  updateFormBackground(form_id: any, background: Image) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.event_record_background = background;
    this.saveFormDb(this.forms[index])
    // this.pushUpdates()
    // console.log(`form ${form_id} background is `,background);
  }

  updateFormScreenSaver(form_id: any, screenSaver: Image[]) {
    let index = this.forms.findIndex((e) => e.form_id === (form_id * 1));
    this.forms[index].event_style.screensaver_media_items = screenSaver;
    this.saveFormDb(this.forms[index])
    // this.pushUpdates()
    // console.log(`form ${form_id} screen saver items `,screenSaver);
  }

  updateFormSubmissions(form_id: any) {
    let form = this.forms.find((e) => e.form_id === (form_id * 1));
    if(form)
    this.dbClient.getSubmissions(form.form_id,false).subscribe((submissions)=>{
      form.total_submissions = submissions.filter((e) => e.status == SubmissionStatus.Submitted).length;
      form.total_unsent = submissions.filter((e) => e.status == SubmissionStatus.ToSubmit).length;
      form.total_hold = submissions.filter((e) => e.status == SubmissionStatus.OnHold).length;
      console.log(`form ${form_id} submissions ${form.total_submissions}, ${form.total_unsent}, ${form.total_hold}`);
      // this.pushUpdates();
    })
  }

  pushUpdates(){
    this.formsObs.next(true);
  }

}
