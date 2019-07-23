import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument, IDocumentCategory} from "../../model";
import {DocumentViewer} from "@ionic-native/document-viewer";
import { File } from '@ionic-native/file';

export enum DocumentShareMode {
  SEND_TO_BACKEND,
  NORMAL_SHARE
}

@IonicPage()
@Component({
  selector: 'documents',
  templateUrl: 'documents.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Documents {
  documentsSource: IDocumentCategory;
  selectedDocuments: {};
  private selectedTheme;
  private shareMode: DocumentShareMode;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: Util,
    private actionSheetCtrl: ActionSheetController,
    private themeProvider: ThemeProvider,
    private documentViewer: DocumentViewer,
    private file: File
  ) {
    this.documentsSource = this.navParams.get('documentSource');
    this.shareMode = this.navParams.get('shareMode') !== undefined ? this.navParams.get('shareMode') : DocumentShareMode.NORMAL_SHARE;
    this.selectedDocuments = [];
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  select(document: IDocument) {
    document.selected = !document.selected;
    this.selectedDocuments[document.name] = document.selected;
    console.log(this.selectedDocuments);
  }

  openDocument(document: IDocument) {
    const path = this.file.applicationDirectory + 'www/' + document.url;

    this.documentViewer.viewDocument(
      path,
      'application/pdf',
      {title: document.name},
      null,
      null,
      null,
      (err) => { console.log('Error opening PDF file => ', err); }
      );
  }

  send() {
    const selectedDocumentsCount = Object.keys(this.selectedDocuments).length;

    if (selectedDocumentsCount) {
      switch (this.shareMode) {
        case DocumentShareMode.NORMAL_SHARE:
          this.shareDocuments();
          break;
        case DocumentShareMode.SEND_TO_BACKEND:
          this.postDocuments();
          break;
        default:
          console.log('Undefined share mode.');
          break;
      }
    }
  }

  postDocuments() {
    console.log('SEND THE DOCUMENT IDs TO THE SERVER');
  }

  shareDocuments() {
    this.actionSheetCtrl.create({
      title: "How do you want to send the docs?",
      buttons: [
        {
          text: 'Email',
          icon: "mail",
          handler: () => {
            console.log('email clicked');
          }
        },
        {
          text: 'SMS',
          icon: "chatbubbles",
          handler: () => {
            console.log('sms clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },

      ],
    }).present();
  }

  normalizeUrl(url: string) {
    return this.util.normalizeURL(url);
  }
}
