import { Subscription } from 'rxjs';
import { Component, Input } from '@angular/core';
import { Form } from '../../model/form';
import { Platform } from 'ionic-angular';
import { ThemeProvider } from '../../providers/theme/theme';
import { SyncClient } from '../../services/sync-client';

// A.S GOC-326

@Component({
  selector: 'event-item',
  templateUrl: 'event-item.html'
})
export class EventItemComponent {

  @Input() form : Form;
  imageLoading : boolean = true;
  themeColor : string;
  syncSub : Subscription;
  constructor(private platform:Platform,private themeProvider:ThemeProvider,private syncClient : SyncClient) {
  }

  ionViewWillEnter(){
   this.themeProvider.getActiveTheme().subscribe(val => this.themeColor = val.replace('-theme',''));
  }

  ngOnInit(){
    this.checkImageDownload();
    // if(!this.syncSub)
    // this.syncSub = this.syncClient.onSync.subscribe(stats => {
		// 	if (stats == null) return;
    //   this.handleSyncing();
		// })
  }

  // handleSyncing(){
  //   let elements = this.syncClient.getLastSync();
  //   let e = elements[elements.length - 1];
  //     if((e.formId == this.form.form_id || e.formName == "Forms" || e.formName == "Submissions") && (e.loading || !e.complete || e.percent < 100))
  //     this.form.isSyncing = true;
  //     else if((e.formId == this.form.form_id || e.formName == "Forms" || e.formName == "Submissions") && (!e.loading || e.complete || e.percent == 100 ))
  //     this.form.isSyncing = false;
  // }

  // ngOnDestroy() {
  //   if(this.syncSub)
  //   this.syncSub.unsubscribe();
  // }

  ionViewDidLeave(){
  }

  checkImageDownload(){
    if(this.form.event_style.event_record_background.path.startsWith('https://'))
    this.imageLoading = true;
    else
    this.imageLoading = false;
  }

  // getRandomImage(){
  //   let width = this.platform.width();
  //   let height = this.platform.height();
  //   height = Math.floor(((height - 50 ) / 3));
  //   let image = `https://picsum.photos/id/30/${width}/${height}`;
  //   console.log(image)
  //   return image;
  // }


}
