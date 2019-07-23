import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {ActionSheetController, Content, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument, IDocumentCategory} from "../../model";
import {DocumentViewer} from "@ionic-native/document-viewer";
import { File } from '@ionic-native/file';
import {FileOpener} from "@ionic-native/file-opener";
import {FileUtils} from "../../util/file";

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
  private documentsSource: IDocumentCategory;
  private selectedDocuments: object = {};
  private selectedTheme;
  private shareMode: DocumentShareMode;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: Util,
    private actionSheetCtrl: ActionSheetController,
    private themeProvider: ThemeProvider,
    private documentViewer: DocumentViewer,
    private file: File,
    private fileOpener: FileOpener,
    private toast: ToastController
  ) {
    this.documentsSource = this.navParams.get('documentSource');
    this.shareMode = this.navParams.get('shareMode') !== undefined ? this.navParams.get('shareMode') : DocumentShareMode.NORMAL_SHARE;
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  select(document: IDocument) {
    document.selected = !document.selected;
    this.selectedDocuments[document.name] = document.selected;
    console.log(this.selectedDocuments);
  }

  async openDocument(document: IDocument) {
    const documentExtension = FileUtils.getFileExtension(document.url);
    const filePath = this.file.applicationDirectory + 'www/' + document.url;

    // open the PDF viewer
    if (documentExtension === 'pdf') {
      console.log('OPENING PDF PREVIEWER FOR DOCUMENT', JSON.stringify(document));

      this.documentViewer.viewDocument(
        filePath,
        'application/pdf',
        {title: document.name},
        null,
        null,
        null,
        (err) => { console.log('Error opening PDF file => ', err); }
      );

    }

    // try use the file opener
    const documentType = FileUtils.getTypeByExtension(documentExtension);
    if (documentType) {
      console.log('TRYING FILE OPENER FOR DOCUMENT', JSON.stringify(document));
      return this.fileOpener.open(filePath, documentType);
    }

    // error
    console.log('CANNOT OPEN DOCUMENT', JSON.stringify(document));
    this.toast.create({
      message: `The selected document couldn't be open. Please try it again later.`,
      duration: 5000,
      position: "top",
      cssClass: "error"
    }).present();
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
