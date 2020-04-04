import { HTTP } from '@ionic-native/http';
import { Image } from '../../model/image';
import { Form } from '../../model/form';
import { Injectable } from '@angular/core';
import { SubmissionStatus } from '../../model';
import { Subject, Observable } from 'rxjs';
import { Entry } from '@ionic-native/file';
import { RESTClient } from './../../services/rest-client';
import { DBClient } from './../../services/db-client';
import { Util } from './../../util/util';

@Injectable()
export class FormsProvider {

  forms: Form[] = [];
  loaded: boolean = false;
  formsObs : Subject<any> = new Subject();
  private hasNewData : boolean;

  constructor(
    private dbClient: DBClient,
    private util : Util, 
    private http : HTTP,
    private rest : RESTClient,
    ) {}

  initForms() {
    if (!this.loaded && this.dbClient.isWorkDbInited()){
      this.dbClient.getForms().subscribe((forms) => {
        forms = this.util.sortBy(forms,-1);
        this.setForms(forms);
        this.pushUpdates();
        this.loaded = true;
      },err=>{
        this.loaded = false;
      })
    }
  }

  setForms(newForms: Form[]){
    newForms.forEach((e : Form)=> {
      let form = this.forms.find((f)=>f.form_id == e.form_id);
      if(form) form = Object.assign(form,e);
      else this.forms.push(e);
    });
  }

  setFormsSyncStatus(val : boolean){
    this.forms.forEach((e)=> e.isSyncing = val);
  }

   downloadForms(lastSyncDate: Date): Observable<Form[]> {
    console.log('Getting latest forms...')
    if(this.forms.length) this.loaded = true;
    else this.loaded = false;
    this.setFormsSyncStatus(true);
    return new Observable<any>(obs => {

    })
  }

  mapForms(forms : Form[]){
   return forms.map(form => {
      form.id = form.form_id + "";
      return form;
    });
  }

  resetForms(){
    this.forms = [];
    this.loaded = false;
  }

  getForms(): Form[] {
    return this.forms
  }

  saveNewForm(form: Form) {
    this.forms.push(form);
    this.pushUpdates();
  }

  saveFormDb(form: Form) {
    this.dbClient.saveForm(form).subscribe();
  }


  pushUpdates(){
    this.formsObs.next(true);
  }

}
