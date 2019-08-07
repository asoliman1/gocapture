import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument, IDocumentSet} from "../../model";
import {DocumentViewer} from "@ionic-native/document-viewer";
import { File } from '@ionic-native/file';
import {FileOpener} from "@ionic-native/file-opener";
import {DocumentsService} from "../../services/documents-service";
import {ShareService} from "../../services/share-service";

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
  private documentSet: IDocumentSet;
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
    private toast: ToastController,
    private documentsService: DocumentsService,
    private shareService: ShareService
  ) {
    this.documentSet = this.navParams.get('documentSet');
    this.shareMode = this.navParams.get('shareMode') !== undefined ? this.navParams.get('shareMode') : DocumentShareMode.NORMAL_SHARE;
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ngOnInit() {

  }

  select(document: IDocument) {
    document.selected = !document.selected;
  }

  async openDocument(document: IDocument) {
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
        (err) => { console.log('Error opening PDF file => ', JSON.stringify(err)); }
      );
    }

    this.fileOpener.open(decodeURIComponent(documentFilePath), document.file_type)
      .then((_) => {
        console.log('DOCUMENT OPENED SUCCESSFULLY');
      })
      .catch((err) => {
        console.log('CANNOT OPEN DOCUMENT', JSON.stringify(document));
        console.log(JSON.stringify(err));
        this.toast.create({
          message: `The selected document couldn't be open. Please try it again later.`,
          duration: 5000,
          position: "top",
          cssClass: "error"
        }).present();
      });
  }

  send() {
    const selectedDocumentsCount = this.documentSet.documents.filter((doc) => doc.selected);

    if (selectedDocumentsCount) {
      this.documentsService.getDocumentsBySet(this.documentSet.id)
        .subscribe((set) => {
          console.log('WE GOT THE DOCUMENTS SET RESULTS ', JSON.stringify(set));
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
        }, (error) => {
          console.log('ERROR WHILE FETCHING THE DOCUMENTS.');
          console.log(error);
        })
    }
  }

  postDocuments() {
    console.log('SEND THE DOCUMENT IDs TO THE SERVER');
  }

  shareDocuments() {
    const links = this.prepareDocumentLinks();

    this.actionSheetCtrl.create({
      title: "How do you want to send the docs?",
      buttons: [
        {
          text: 'Email',
          icon: "mail",
          handler: async () => {
            console.log('email clicked');
            await this.shareService.shareViaEmail(links, this.documentSet.name, ['']);
          }
        },
        {
          text: 'SMS',
          icon: "chatbubbles",
          handler: async () => {
            console.log('sms clicked');
            await this.shareService.shareViaSMS(links, '');
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
            this.shareService.shareViaFacebook(links);
          }
        },
        {
          text: 'Instagram',
          icon: "logo-instagram",
          handler: async () => {
            console.log('instagram clicked');
            await this.shareService.shareViaInstagram(links, '');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },

      ],
    }).present();
  }


  close() {
    this.documentSet.documents.forEach((doc) => doc.selected = false);
  }

  private prepareDocumentLinks() {
    return this.documentSet.documents
      .filter((document) => document.selected)
      .map((document) => document.vanity_url)
      .join(', ');
  }

  private documentsFolder(): string {
    return this.file.dataDirectory + "leadliaison/documents/";
  }
}
