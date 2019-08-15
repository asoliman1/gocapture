import {AfterViewInit, Component} from '@angular/core';
import {
  ActionSheetController,
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument, IDocumentSet} from "../../model";
import {DocumentViewer} from "@ionic-native/document-viewer";
import { File } from '@ionic-native/file';
import {FileOpener} from "@ionic-native/file-opener";
import {DocumentsService} from "../../services/documents-service";
import {ShareService} from "../../services/share-service";
import {DocumentsSyncClient} from "../../services/documents-sync-client";

export enum DocumentShareMode {
  SUBMISSION,
  SHARE
}

@IonicPage()
@Component({
  selector: 'documents',
  templateUrl: 'documents.html',
})
export class Documents implements AfterViewInit {
  private DocumentShareMode = DocumentShareMode;
  private documentSet: IDocumentSet;
  private selectedTheme;
  private shareMode: DocumentShareMode;
  private readonlyMode: boolean = false;

  private selectedDocCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: Util,
    private actionSheetCtrl: ActionSheetController,
    private themeProvider: ThemeProvider,
    private documentViewer: DocumentViewer,
    private file: File,
    private fileOpener: FileOpener,
    private toast: ToastController,
    private documentsService: DocumentsService,
    private documentsSyncClient: DocumentsSyncClient,
    private shareService: ShareService,
    public viewCtrl: ViewController,
  ) {
    this.documentSet = this.navParams.get('documentSet');
    this.shareMode = this.navParams.get('shareMode') !== undefined ? this.navParams.get('shareMode') : DocumentShareMode.SHARE;
    this.readonlyMode = this.navParams.get('readOnly');
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ngAfterViewInit() {
    if (this.documentSet && this.documentSet.selectedDocumentIdsForSubmission) {
      this.selectedDocCount = this.documentSet.selectedDocumentIdsForSubmission.length;
    }
  }

  select(document: IDocument) {
    if (this.readonlyMode) {
      return;
    }

    document.selected = !document.selected;
    document.selected ? this.selectedDocCount++ : this.selectedDocCount--;
  }

  async openDocument(document: IDocument) {
    if (!document.file_path) {
      return this.documentsSyncClient.showSyncingToast();
    }

    // open the PDF viewer
    let filename =  document.file_path.split('/').pop();
    let documentFilePath = this.documentsFolder() + filename;
    if (document.file_type === 'application/pdf') {
      console.log('OPENING PDF PREVIEWER FOR DOCUMENT', JSON.stringify(document));

      return this.documentViewer.viewDocument(
        documentFilePath,
        'application/pdf',
        {title: document.name},
        null,
        null,
        null,
        (err) => {
          console.log('Error opening PDF file => ', JSON.stringify(err));
          this.showDocumentOpeningErrorToast();
        }
      );
    }

    this.fileOpener.open(decodeURIComponent(documentFilePath), document.file_type)
      .then((_) => {
        console.log('DOCUMENT OPENED SUCCESSFULLY');
      })
      .catch((err) => {
        console.log('CANNOT OPEN DOCUMENT', JSON.stringify(document));
        console.log(JSON.stringify(err));
        this.showDocumentOpeningErrorToast();
      });
  }

  submitSelectedDocuments() {
    console.log('SEND THE DOCUMENT IDs TO THE SERVER');
    this.viewCtrl.dismiss(
     this.documentSet.documents
      .filter((document) => document.selected)
      .map((document) => document.id)
    );
  }

  shareDocuments() {
    const links = this.prepareDocumentLinks();

    const buttons: [any] = [
      {
        text: 'Email',
        icon: "mail",
        handler: async () => {
          console.log('email clicked');
          const emailLinks = this.prepareDocumentLinks('\n');
          await this.shareService.shareViaEmail(emailLinks, this.documentSet.name, null);
        }
      },
      {
        text: 'SMS',
        icon: "chatbubbles",
        handler: async () => {
          console.log('sms clicked');
          await this.shareService.shareViaSMS(links, null);
        }
      },
      {
        text: 'WhatsApp',
        icon: "logo-whatsapp",
        handler: async () => {
          console.log('WhatsApp clicked');
          await this.shareService.shareViaWhatsApp(links);
        }
      },
      {
        text: 'Facebook',
        icon: "logo-facebook",
        handler: () => {
          console.log('facebook clicked');
          this.shareService.shareViaFacebook(links, null, null);
        }
      },
      {
        text: 'Instagram',
        icon: "logo-instagram",
        handler: async () => {
          console.log('instagram clicked');
          await this.shareService.shareViaInstagram(links, null);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
      }
    ];

    const actionSheet = this.actionSheetCtrl.create({
      title: 'How do you want to send the docs?',
      buttons,
      cssClass: this.selectedTheme.toString()
    });

    actionSheet.present();
  }


  close() {
    this.documentSet.documents.forEach((doc) => doc.selected = false);
  }

  private prepareDocumentLinks(separator?: string) {
    return this.documentSet.documents
      .filter((document) => document.selected)
      .map((document) => document.vanity_url)
      .join(separator || ', ');
  }

  private documentsFolder(): string {
    return this.file.dataDirectory + "leadliaison/documents/";
  }

  private showDocumentOpeningErrorToast() {
    this.toast.create({
      message: `Couldn’t open the document. Please try again.`,
      duration: 5000,
      position: "top",
      cssClass: "error"
    }).present();
  }
}
