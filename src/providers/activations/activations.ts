import { Image } from './../../model/image';
import { Activation } from './../../model/activation';
import { Injectable } from '@angular/core';
import { Util } from '../../util/util';
import { HTTP } from '@ionic-native/http';
import { RESTClient } from '../../services/rest-client';
import { Form } from '../../model';
import { Entry } from '@ionic-native/file';
import { ACTIVATIONS_PARAMS } from '../../constants/activations-params';
import { tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const storageKey = 'activations';
const SCREEN_SAVERS_KEY = 'screensavers';

@Injectable()
export class ActivationsProvider {

  hasNewData: boolean;
  sortBy = ACTIVATIONS_PARAMS.SORT_BY.UPDATE_DATE;
  sortOrder = ACTIVATIONS_PARAMS.SORT_ORDER.DESC;
  isThereNoActivations: boolean = false;

  constructor(
    private util: Util,
    private http: HTTP,
    private storage: Storage,
    private restClient: RESTClient) {
  }

  getAllActivations(actName: string = '') {
    return this.restClient.getAllFormsWithActivations(
      {
        activation_name: actName,
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
        group_by: 'event'
      }
    ).pipe(
      tap((e) => this.downloadActivationsData(e.activations))
    );
  }


  getFormActivations(form: Form, actName: string = '') {
    return this.restClient.getFormActivations(form,
      {
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
        activation_name: actName
      }
    ).pipe(
      tap((e) => this.downloadActivationsData(e))
    );
  }

  saveStorage(data: any, key?: string) {
    key = key ? '-' + key : '';
    return this.storage.set(`${storageKey}${key}`, data);
  }

  getStorage(key?: string) {
    key = key ? '-' + key : '';
    return this.storage.get(`${storageKey}${key}`);
  }

  clearStorage(key?: string) {
    key = key ? '-' + key : '';
    return this.saveStorage([], `${storageKey}${key}`);
  }

  private downloadActivationsData(activations: Activation[]) {
    activations.forEach(async (act: Activation) => {
      if (act.activation_style.is_event_screensaver) {act.activation_style.screensaver_media_items = act.event.event_style.screensaver_media_items;
        act.activation_style.screensaver_rotation_period = act.event.event_style.screensaver_rotation_period;
        act.activation_style.switch_frequency = act.event.event_style.switch_frequency;
      }
      else if (! await this.checkSSfiles(act)) {
        this.downloadActivationData(act);
      }
    })
  }

  private async checkSSfiles(act: Activation) {
    let data = await this.getStorage(`${SCREEN_SAVERS_KEY}-${act.id}`);
    console.log(data);
    let oldSS: Image[] = data ? data.screen_savers : [],
      newSS = act.activation_style.screensaver_media_items;
    if (oldSS.length != newSS.length) return false;
    for (let index = 0; index < newSS.length; index++) {
      const element = newSS[index];
      if (!oldSS.find((e) => e.url == element.url && e.path != '')) return false;
    }
    act.activation_style.screensaver_media_items = data.screen_savers;
    return true;
  }

  private downloadActivationData(act: Activation) {
    console.log(`Downloading activation ${act.id} data...`);
    this.downloadActivationSs(act);
  }


  private async downloadActivationSs(act: Activation) {
    act.activation_style.screensaver_media_items = await Promise.all(act.activation_style.screensaver_media_items.map(async (e, i) => {
      if (e.path == '' && e.url.startsWith('https://')) {
        let entry: Entry;
        try {
          let file = this.util.getFilePath(e.url, `activation_${act.id}_ss_${i}`);
          entry = await this.http.downloadFile(file.pathToDownload, {}, {}, file.path);
          e = { path: entry.nativeURL, url: e.url };
        } catch (error) {
          console.log('Error downloading an activation ss image', error)
        }
        return e;
      }
    }));

    await this.saveStorage({ activation_id: act.id, screen_savers: act.activation_style.screensaver_media_items }, SCREEN_SAVERS_KEY + '-' + act.id);
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



}
