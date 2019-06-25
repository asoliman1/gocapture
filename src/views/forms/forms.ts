import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Popup } from './../../providers/popup/popup';
import { BarcodeStatus, FormSubmissionType } from './../../model/form-submission';
import {
  Component, ViewChild, NgZone
} from '@angular/core';

import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

import { Subscription } from "rxjs/Subscription";

import { SyncClient } from "../../services/sync-client";
import { BussinessClient } from "../../services/business-service";
import {Form, FormSubmission, SubmissionStatus} from "../../model";
import { FormCapture } from "../form-capture";
import { FormReview } from "../form-review";
import { FormControlPipe } from "../../pipes/form-control-pipe";
import { Searchbar } from 'ionic-angular/components/searchbar/searchbar';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { InfiniteScroll } from 'ionic-angular/components/infinite-scroll/infinite-scroll';
import {ThemeProvider} from "../../providers/theme/theme";
import {FormInstructions} from "../form-instructions";
import * as moment from 'moment';


@Component({
  selector: 'forms',
  templateUrl: 'forms.html',
  animations: [
    // Define an animation that adjusts the opactiy when a new item is created
    //  in the DOM. We use the 'visible' string as the hard-coded value in the
    //  trigger.
    //
    // When an item is added we wait for 300ms, and then increase the opacity to 1
    //  over a 200ms time interval. When the item is removed we don't delay anything
    //  and use a 200ms interval.
    //
    trigger('visibleTrigger', [
      state('visible', style({ opacity: '1', height: '5.8rem' })),
      state('hidden', style({ opacity: '0', height: '0' })),
      transition('visible => hidden', [animate('300ms 200ms')]),
      transition('hidden => visible', [animate('300ms 100ms')])
    ]),
    trigger('loadingTrigger', [
      state('visible', style({ transform: 'translateY(256px)' })),
      state('hidden', style({ transform: 'translateY(300px)' })),
      transition('visible => hidden', [animate('300ms 200ms')]),
      transition('hidden => visible', [animate('300ms 100ms')])
    ])
  ]
})
export class Forms {

  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar: Searchbar;

  forms: Form[] = [];
  filteredForms: Form[] = [];

  private sub : Subscription;

  private filterPipe: FormControlPipe = new FormControlPipe();

  private selectedTheme;
  private duplicateLeadSubscription: Subscription;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private client: BussinessClient,
              private zone: NgZone,
              private actionCtrl: ActionSheetController,
              private syncClient: SyncClient,
              private themeProvider: ThemeProvider,
              private popup: Popup,
              private toast: ToastController) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  doRefresh(refresher?) {
    this.client.getForms().subscribe(forms => {
      this.zone.run(()=>{
        this.forms = this.filterPipe.transform(forms, "");
        this.getItems({target: {value: ""}});
      });
    });
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    this.searchTrigger = this.searchMode ? "visible" : "hidden";
    if(this.searchMode){
      setTimeout(()=>{
        this.searchbar.setFocus();
      }, 100);
    }
  }

  doInfinite(infiniteScroll?: InfiniteScroll) {
    this.client.getForms().subscribe(forms => {
      this.forms = this.forms.concat(forms);
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    });
  }

  sync() {
    this.client.getUpdates().subscribe(()=> {});
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.filteredForms = [].concat(this.forms.filter(form => {
      return !val || regexp.test(form.name);
    }));

    this.filteredForms.forEach(form => {
      this.getUnsentSubmissions(form);
    })
  }

  presentActionSheet(form: Form) {

    let buttons: [any] =  [
      {
        text: 'Capture',
        icon: "magnet",
        handler: () => {
          //console.log('capture clicked');
          this.navCtrl.push(FormCapture, { form: form });
        }
      }];

    if (form.is_enable_rapid_scan_mode) {
      buttons.push({
        text: 'Rapid Scan',
        icon: "qr-scanner",
        handler: () => {
          //console.log('review clicked');
          this.navCtrl.push(FormCapture, { form: form, isRapidScanMode: true });
        }
      })
    }

    buttons.push({
      text: 'Review Submissions',
      icon: "eye",
      handler: () => {
        //console.log('review clicked');
        this.navCtrl.push(FormReview, { form: form, isDispatch: false });
      }
    });


    if (form.instructions_content && form.instructions_content.length > 0) {
      buttons.push({
        text: 'Instructions',
        icon: "paper",
        handler: () => {
          //console.log('review clicked');
          this.navCtrl.push(FormInstructions, { form: form });
        }
      })
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        //console.log('Cancel clicked');
      }
    });


    let actionSheet = this.actionCtrl.create({
      title: form.name,
      buttons: buttons,
      cssClass: this.selectedTheme.toString()
    });
    actionSheet.present();
  }

  ionViewDidEnter() {
    this.doRefresh();
    this.registerDuplicateLeadHandler();
    this.sub = this.syncClient.entitySynced.subscribe((type)=>{
      if(type == "Forms" || type == "Submissions") {
        this.doRefresh();
      }
    });
  }

  private registerDuplicateLeadHandler() {
    this.duplicateLeadSubscription = this.syncClient.duplicateLead
      .subscribe((data) => {
        if (!data) {
          return;
        }

        const date = moment(data.submission.submission_date).format('MMM DD[th], YYYY [at] hh:mm A');
        this.popup.showAlert('Duplicate Lead', 
          `This lead has already been captured on ${date}. Do you want to edit it?`, 
          [{ text: 'Remove', handler: () => {
            this.client.removeSubmission({id: data.id}).subscribe((_) => {
              this.doRefresh();

              this.toast.create({
                message: "Duplicate lead removed successfully.",
                duration: 1500,
                position: "bottom",
                cssClass: "success"
              }).present();
            }, (err) => {
              console.log("ERR ", err);
            })
          }},
          { text: 'Edit', handler: () => {
            this.client.removeSubmission({id: data.id}).subscribe((_) => {
              const form = this.forms.find((f) => f.form_id == data.form_id);
              const submission = this.mapDuplicateResponseToSubmission(data);
              this.navCtrl.push(FormCapture, { form: form, submission: submission, openEdit: true });
            }, (err) => {
              console.log("ERR ", err);
            })
          }}
        ]);
      });
  }


  private mapDuplicateResponseToSubmission(data: any) {
    const submission = new FormSubmission;
    submission.id = data.submission.activity_id;
    submission.form_id = parseInt(data.form_id);
    submission.activity_id = data.submission.activity_id;
    submission.prospect_id = data.submission.prospect_id;
    submission.email = data.submission.email;
    submission.sub_date = data.submission.submission_date;
    submission.status = SubmissionStatus.Submitted;
    submission.barcode_processed = data.submission.barcode_processed || BarcodeStatus.None;
    submission.submission_type = data.submission.submission_type || FormSubmissionType.normal;
    
    submission.fields = {};
    data.submission.data.forEach((el) => {
      if (el.value_splitted) {
        Object.keys(el.value_splitted).forEach((key) => {
          submission.fields[key] = el.value_splitted[key];
        });
      } else {
        if (el["value"]) {
          submission.fields["element_" + el['element_id']] = el["value"];
        }
      }
    });

    return submission;
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
    this.duplicateLeadSubscription.unsubscribe();
  }

  ngOnDestroy() {
    if (this.duplicateLeadSubscription) {
      this.duplicateLeadSubscription.unsubscribe();
    }
  }

  getUnsentSubmissions(form: Form) {
    this.client.getSubmissions(form, false).subscribe(submissions => {
      form.total_unsent = submissions.filter((sub)=>{
        return (sub.status == SubmissionStatus.ToSubmit) || (sub.status == SubmissionStatus.Submitting) || (sub.status == SubmissionStatus.Blocked);
      }).length;
    });
  }

}
