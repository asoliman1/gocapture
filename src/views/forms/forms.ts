import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Popup } from '../../providers/popup/popup';
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
import {Form, SubmissionStatus} from "../../model";
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
import {DuplicateLeadsService} from "../../services/duplicate-leads-service";
import {DocumentsListPage} from "../../pages/documents-list/documents-list";
import {ModalController} from "ionic-angular";


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

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private client: BussinessClient,
              private zone: NgZone,
              private actionCtrl: ActionSheetController,
              private syncClient: SyncClient,
              private themeProvider: ThemeProvider,
              private popup: Popup,
              private toast: ToastController,
              private duplicateLeadsService: DuplicateLeadsService,
              private modalCtrl: ModalController) {
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
          this.duplicateLeadsService.registerDuplicateLeadHandler(this.forms);
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

    const documentSets = this.getDocuments(form);
    console.log('DOCUMENTS SETS, ', documentSets);
    if (documentSets.length) {
      if (documentSets.length === 1) {
        buttons.push({
          text: 'Documents',
          icon: 'bookmarks',
          handler: () => {
            this.modalCtrl.create('Documents', {documentSet: documentSets[0]}).present();
          }
        })
      } else {
        buttons.push({
          text: 'Documents',
          icon: 'bookmarks',
          handler: () => {
            this.navCtrl.push("DocumentsListPage", { form });
          }
        })
      }
    }

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
    this.sub = this.syncClient.entitySynced.subscribe((type)=>{
      if(type == "Forms" || type == "Submissions") {
        this.doRefresh();
      }
    });
  }

  ionViewDidLeave() {
    this.sub.unsubscribe();
  }

  getUnsentSubmissions(form: Form) {
    this.client.getSubmissions(form, false).subscribe(submissions => {
      form.total_unsent = submissions.filter((sub)=>{
        return (sub.status == SubmissionStatus.ToSubmit) || (sub.status == SubmissionStatus.Submitting) || (sub.status == SubmissionStatus.Blocked);
      }).length;
    });
  }

  private getDocuments(form: Form) {
    return form.elements
      .filter((el) => el.type === 'documents')
      .map((el) => el.documents_set);
  }
}
