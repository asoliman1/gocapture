import { Popup } from './../../providers/popup/popup';
import { FormsProvider } from './../../providers/forms/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { Component, ViewChild, NgZone } from '@angular/core';
import { BussinessClient } from "../../services/business-service";
import { Form, User } from "../../model";
import { FormCapture } from "../form-capture";
import { FormReview } from "../form-review";
import { Searchbar } from 'ionic-angular/components/searchbar/searchbar';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { FormInstructions } from "../form-instructions";
import { DuplicateLeadsService } from "../../services/duplicate-leads-service";
import { ModalController } from "ionic-angular";
import { DocumentsService } from "../../services/documents-service";
import { unionBy } from 'lodash';
import { ActivationsPage } from '../activations/activations';
import { DBClient } from '../../services/db-client';
import { ThemeProvider } from '../../providers/theme/theme';

@Component({
  selector: 'forms',
  templateUrl: 'forms.html',
})
export class Forms {

  searchMode = false;

  searchTrigger = "hidden";

  user: User = new User();

  @ViewChild("search") searchbar: Searchbar;

  forms: Form[] = [];

  syncDisabled: boolean;

  constructor(private navCtrl: NavController,
    private client: BussinessClient,
    private popup: Popup,
    private duplicateLeadsService: DuplicateLeadsService,
    private modalCtrl: ModalController,
    private documentsService: DocumentsService,
    public formsProvider: FormsProvider,
    private zone: NgZone,
    private Keyboard: Keyboard,
    private dbClient: DBClient,
    private themeProvider: ThemeProvider
  ) {
    this.getForms();
  }

  ngOnInit() {
    this.client.userUpdates.subscribe((user: User) => {
      this.user = user
    })
    this.dbClient.getRegistration().subscribe((user) => {
      this.user = user;
    })
  }

  getForms() {
    this.formsProvider.formsObs.subscribe((val) => {
      if (val) this.updateForms()
    }, (err) => {
    }, () => {
    })

  }

  updateForms() {
    this.zone.run(() => {
      this.forms = this.formsProvider.forms;
    })
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    this.searchTrigger = this.searchMode ? "visible" : "hidden";
    if (this.searchMode) {
      setTimeout(() => {
        if (this.searchbar)
          this.searchbar.setFocus();
      }, 100);
    }
  }


  sync() {
    this.syncDisabled = true;
    this.client.getUpdates().subscribe(() => {
    }, (err) => {
      this.syncDisabled = false;
    }, () => {
      this.syncDisabled = false;
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
        text: 'forms.capture',
        icon: "magnet",
        handler: () => {
          //console.log('capture clicked');
          this.duplicateLeadsService.registerDuplicateLeadHandler(this.forms);
          this.navCtrl.push(FormCapture, { form: form });
          this.setFormTheme(form);
        }
      }];

    if (form.is_enable_rapid_scan_mode) {
      buttons.push({
        text: 'forms.rapid-scan',
        icon: "qr-scanner",
        handler: () => {
          //console.log('review clicked');
          this.navCtrl.push(FormCapture, { form: form, isRapidScanMode: true });
          this.setFormTheme(form);

        }
      })
    }

    buttons.push({
      text: 'forms.review-submissions',
      icon: "eye",
      handler: () => {
        //console.log('review clicked');
        this.navCtrl.push(FormReview, { form: form, isDispatch: false });
        this.setFormTheme(form);

      }
    });

    const documentSets = this.getDocuments(form);
    if (documentSets.length) {
      buttons.push({
        text: 'forms.documents',
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

           let modal = this.modalCtrl.create('Documents', { documentSet: { ...documentSets[0], documents } })
           modal.present();
            modal.onWillDismiss(()=> this.themeProvider.setDefaultTheme())
          } else {
            this.navCtrl.push("DocumentsListPage", { form });
          }
          this.setFormTheme(form);

        }
      })
      // }
    }

    if (form.instructions_content && form.instructions_content.length > 0) {
      buttons.push({
        text: 'forms.instructions',
        icon: "paper",
        handler: () => {
          //console.log('review clicked');
          this.navCtrl.push(FormInstructions, { form: form });
          this.setFormTheme(form);

        }
      })
    }

    if (form.activations.length && this.user.activations)
      buttons.push({
        'text': 'forms.activations',
        'icon': 'game-controller-b',
        handler: () => {
          this.navCtrl.push(ActivationsPage, { form: form });
          this.setFormTheme(form);
        }
      })

    buttons.push({
      text: 'general.cancel',
      role: 'cancel',
      handler: () => {
        //console.log('Cancel clicked');
      }
    });

    this.popup.showActionSheet(form.name, buttons);
  }

  setFormTheme(form: Form) {
    console.log(form.event_style.theme)
    if (form.event_style.theme)
      this.themeProvider.setTempTheme(form.event_style.theme);
  }

  ionViewDidEnter() {
    // A.S
    this.Keyboard.setResizeMode("ionic");
    this.forms = this.formsProvider.forms;
  }

  ionViewWillEnter() {
    this.themeProvider.setDefaultTheme();
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
