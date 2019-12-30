import { Image } from './../../model/image';
import { Activation } from './../../model/activation';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DBClient } from '../../services/db-client';
import { Util } from '../../util/util';
import { HTTP } from '@ionic-native/http';
import { RESTClient } from '../../services/rest-client';
import { Form } from '../../model';
import { Entry } from '@ionic-native/file';
@Injectable()
export class ActivationsProvider {

  public activations : Activation[] = [];
  loaded: boolean = false;
  activationsObs : Subject<any> = new Subject();
  hasNewData : boolean;

  constructor( 
    private dbClient: DBClient,
    private util : Util, 
    private http : HTTP,
    private rest : RESTClient) {
  }

  setActivations() {
    if (!this.loaded && this.dbClient.isWorkDbInited()){
      this.loaded = true;
      this.dbClient.getActivations().subscribe((activations) => {
        this.activations = activations;
        this.pushUpdates();
      })
    }
  }

  pushUpdates(){
    this.activationsObs.next(true);
  }

  downloadActivations(forms: Form[]): Observable<Activation[]> {
    console.log('Getting latest Activations...')
    return new Observable<any>(obs => {
      this.rest.getAllActivations(forms)
      .subscribe((remoteActivations) => {
        // remoteActivations.activations = this.checkActivationData(remoteActivations.activations , []);
        this.saveNewActivations(remoteActivations.activations);
        if (this.hasNewData) this.downloadActivationsData(remoteActivations.activations); // A.S check if form has data to be downloaded - A.S GOC-326
          obs.next(remoteActivations.activations);
        },(err)=>{
          obs.error(err);
        },()=>obs.complete())

    })
  }

  private async downloadActivationsData(activations: Activation[]) {
    console.log('Downloading activations data...');
    await Promise.all(activations.map(async (act: Activation) => {
      await this.downloadActivationData(act);
    }))
    this.hasNewData = false;
    console.log('Downloading forms data finished');
  }

  private async downloadActivationData(act: Activation) {
    await this.downloadActivationBackground(act);
  }


  private async downloadActivationBackground(act: Activation) {
    if (act.activation_identifier.background_image.url != '' && act.activation_identifier.background_image.path.startsWith('https://')) {
      let entry: Entry;
      // this.updateFormSyncStatus(form.form_id, true)
      try {
        let file = this.util.getFilePath(act.activation_identifier.background_image.url, `activation_${act.id}_`);
        entry = await this.http.downloadFile(file.pathToDownload,{},{}, file.path);
        act.activation_identifier.background_image = { path: entry.nativeURL, url: act.activation_identifier.background_image.url };
      } catch (error) {
        console.log('Error downloading a form background image', error)
      }
      this.updateActivationBackground(act.id, act.activation_identifier.background_image);
      // this.updateFormSyncStatus(form.form_id, false)
    }
  }

  updateActivationBackground(id: any, background: Image) {
    let index = this.activations.findIndex((e) => e.id === (id * 1));
    this.activations[index].activation_identifier.background_image = background;
    this.saveActivationDb(this.activations[index])
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


  // A.S GOC-384 check Activation data if downloaded
  private checkActivationData(newActs: any[], oldActs: Activation[]) {
    return newActs.map((act) => {
      let oldAct = oldActs.find(f => f.id == act.id);
      // check activation background image
      let actBg = act.activation_identifier.background_image;
      act.activation_identifier.background_image = { path: this.checkFile(actBg, oldAct && oldAct.activation_identifier ? oldAct.activation_identifier.background_image : null, `activation_${act.id}_`), url: actBg };

      return act;
    })
  }


  getActivations(): Activation[] {
    return this.activations;
  }

  saveNewActivation(activation: Activation) {
    this.activations.push(activation);
    this.pushUpdates();
  }

  saveActivationDb(activation: Activation) {
    this.dbClient.saveActivation(activation).subscribe();
  }

  saveNewActivations(activations: Activation[]) {
    activations.forEach((e : Activation)=> {
      let act = this.activations.find((f)=>f.id == e.id);
      if(act) act = Object.assign(act,e);
      else this.activations.push(e);
    });
    // this.activations.forEach((e)=>{
    //   if(availableForms.findIndex((a)=> a == e.form_id) == -1) this.deleteActivation(e);
    // })
    this.dbClient.saveActivations(activations).subscribe();
    this.pushUpdates();
  }

  deleteActivation(activation: Activation) {
    this.activations = this.activations.filter((e) => e.id !== activation.id);
    this.dbClient.deleteActivation(activation).subscribe();
  }

}
