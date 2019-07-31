import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument, IDocumentSet} from "../../model";
import {DocumentViewer} from "@ionic-native/document-viewer";
import { File } from '@ionic-native/file';
import {FileOpener} from "@ionic-native/file-opener";
import {DocumentsService} from "../../services/documents-service";
import {SocialSharing} from "@ionic-native/social-sharing";

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
    private toast: ToastController,
    private documentsService: DocumentsService,
    private socialSharing: SocialSharing
  ) {
    this.documentSet = this.navParams.get('documentSet');
    this.shareMode = this.navParams.get('shareMode') !== undefined ? this.navParams.get('shareMode') : DocumentShareMode.NORMAL_SHARE;
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  select(document: IDocument) {
    document.selected = !document.selected;
    this.selectedDocuments[document.name] = document.selected;
    // this.documentsService.saveDocument(document.id)
    //   .subscribe((data) => {
    //     if (document.file_type === 'application/pdf') {
    //       this.documentViewer.viewDocument(
    //         data,
    //         'application/pdf',
    //         {title: document.name},
    //         null,
    //         null,
    //         null,
    //         (err) => { console.log('Error opening PDF file => ', err); }
    //       );
    //     } else {
    //       document.url = data;
    //       this.fileOpener.open(data, document.file_type);
    //     }
    //   }, (err) => {
    //     console.log('SOME ERROR OCCURRED;');
    //     console.log(err);
    //   })
    console.log(this.selectedDocuments);
  }

  async openDocument(document: IDocument) {
    // open the PDF viewer
    if (document.file_type === 'application/pdf') {
      console.log('OPENING PDF PREVIEWER FOR DOCUMENT', JSON.stringify(document));

      return this.documentViewer.viewDocument(
        document.file_path,
        'application/pdf',
        {title: document.name},
        null,
        null,
        null,
        (err) => { console.log('Error opening PDF file => ', err); }
      );

    }

    console.log('TRYING FILE OPENER FOR DOCUMENT', JSON.stringify(document));
    this.fileOpener.open(document.file_path, '')
      .then((_) => {
        console.log('DOCUMENT OPENED SUCCESSFULLY');
      })
      .catch((err) => {
        // error
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
    const message = this.prepareDocumentsMessage();

    this.actionSheetCtrl.create({
      title: "How do you want to send the docs?",
      buttons: [
        {
          text: 'Email',
          icon: "mail",
          handler: () => {
            console.log('email clicked');
            this.shareViaEmail(message);
          }
        },
        {
          text: 'SMS',
          icon: "chatbubbles",
          handler: () => {
            console.log('sms clicked');
            this.shareViaSMS(message);
          }
        },
        {
          text: 'WhatsApp',
          icon: "logo-whatsapp",
          handler: () => {
            console.log('WhatsApp clicked');
            this.shareViaWhatsapp(message);
          }
        },
        {
          text: 'Facebook',
          icon: "logo-facebook",
          handler: () => {
            console.log('facebook clicked');
            this.shareViaFacebook(message);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },

      ],
    }).present();
  }

  private shareViaEmail(message: string) {
    this.socialSharing.canShareViaEmail()
      .then((_) => {
        this.socialSharing.shareViaEmail(message, 'LeadLiaison Documents', [''])
          .then((_) => {
            console.log('EMAIL SHARED SUCCESSFULLY');
          })
          .catch((err) => {
            console.log('EMAIL FAILED. ', JSON.stringify(err));
          })
      })
      .catch((err) => {
        console.log('CANNOT SHARE VIA EMAIL ', JSON.stringify(err));
      })
  }

  private shareViaSMS(message: string) {
    this.socialSharing.shareViaSMS(message, '')
      .then((_) => {
        console.log('SMS SHARED SUCCESSFULLY');
      })
      .catch((err) => {
        console.log("SMS COULDN'T BE SENT ", err);
      });
  }

  private shareViaFacebook(message: string) {
    this.socialSharing.shareViaFacebook(message)
      .then((_) => {
        console.log('SHARED VIA FACEBOOK SUCCESSFULLY');
      })
      .catch((err) => {
        console.log("COULDN'T SHARE VIA FACEBOOK ", JSON.stringify(err));
      })
  }

  private shareViaWhatsapp(message: string) {
      this.socialSharing.shareViaWhatsApp(message)
        .then((_) => {
          console.log('SHARED VIA WHATSAPP SUCCESSFULLY');
        })
        .catch((err) => {
          console.log("COULDN'T SHARE VIA WHATSAPP ", JSON.stringify(err));
        })
  }

  // TODO: implement this
  private prepareDocumentsMessage() {
    return 'Test message';
  }
}
