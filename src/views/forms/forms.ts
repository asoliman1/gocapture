import { FormsProvider } from './../../providers/forms/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { Component, ViewChild } from '@angular/core';
import { SyncClient } from "../../services/sync-client";
import { BussinessClient } from "../../services/business-service";
import { Form } from "../../model";
import { FormCapture } from "../form-capture";
import { FormReview } from "../form-review";
import { Searchbar } from 'ionic-angular/components/searchbar/searchbar';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { ThemeProvider } from "../../providers/theme/theme";
import { FormInstructions } from "../form-instructions";
import { DuplicateLeadsService } from "../../services/duplicate-leads-service";
import { ModalController } from "ionic-angular";
import { DocumentsService } from "../../services/documents-service";
import { unionBy } from 'lodash';

@Component({
  selector: 'forms',
  templateUrl: 'forms.html',
})
export class Forms {

  searchMode = false;

  searchTrigger = "hidden";

  @ViewChild("search") searchbar: Searchbar;

  forms: Form[] = [];

  private selectedTheme : string;

  constructor(private navCtrl: NavController,
    private client: BussinessClient,
    private actionCtrl: ActionSheetController,
    private themeProvider: ThemeProvider,
    private duplicateLeadsService: DuplicateLeadsService,
    private syncClient: SyncClient,
    private modalCtrl: ModalController,
    private documentsService: DocumentsService,
    public formsProvider : FormsProvider,
    private Keyboard : Keyboard) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val.toString());
    this.getForms();
  }

  getForms(){
    this.formsProvider.formsObs.subscribe((val)=>{
      if(val) this.forms = this.formsProvider.forms;
    })
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    this.searchTrigger = this.searchMode ? "visible" : "hidden";
    if (this.searchMode) {
      setTimeout(() => {
        this.searchbar.setFocus();
      }, 100);
    }
  }


  sync() {
    if(this.syncClient.isSyncing()){
      console.log('Sync is in progress')
      return;
    } 
      console.log('Sync started');
    this.client.getUpdates().subscribe(() => {
    });
  }

  getItems(event) {
    let val = event.target.value;
    let regexp = new RegExp(val, "i");
    this.forms = this.formsProvider.forms.filter(form => {
      return !val || regexp.test(form.name);
    });
  }

  presentActionSheet(form: Form) {

    let buttons: [any] = [
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
    if (documentSets.length) {
      buttons.push({ 
        text: 'Documents',
        icon: 'bookmarks',
        handler: async () => {
          if (documentSets.length === 1) {
            const docs = await this.documentsService
              .getDocumentsByIds(documentSets[0].documents.map((doc) => doc.id))
              .toPromise(); 

            let documents;
            if (docs && docs.length) {
              documents = unionBy(docs, documentSets[0].documents, 'id');
            } else {
              documents = documentSets[0].documents;
            }

            this.modalCtrl.create('Documents', { documentSet: { ...documentSets[0], documents } }).present();
          } else {
            this.navCtrl.push("DocumentsListPage", { form }); 
          } 
        }
      })
      // }
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
    // A.S
    this.Keyboard.setResizeMode("ionic");
    this.forms = this.formsProvider.forms;
  }

  ionViewDidLeave() {
    // A.S
    this.Keyboard.setResizeMode("native");
  }

  // A.S GOC-315

  private getDocuments(form: Form) {
    return form.elements
      .filter((el) => el.type === 'documents')
      .map((el) => el.documents_set);
  }
}
