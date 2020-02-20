import { AfterViewInit, Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { Util } from "../../util/util";
import { ThemeProvider } from "../../providers/theme/theme";
import { IDocument, IDocumentSet } from "../../model";
import { File } from '@ionic-native/file';
import { FileOpener } from "@ionic-native/file-opener";
import { ShareService } from "../../services/share-service";
import { DocumentsSyncClient } from "../../services/documents-sync-client";
import { Popup } from '../../providers/popup/popup';

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
  DocumentShareMode = DocumentShareMode;
  documentSet: IDocumentSet;
  selectedTheme;
  shareMode: DocumentShareMode;
  readonlyMode: boolean = false;

  selectedDocCount: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: Util,
    private themeProvider: ThemeProvider,
    private file: File,
    private fileOpener: FileOpener,
    private popup: Popup,
    private documentsSyncClient: DocumentsSyncClient,
    private shareService: ShareService,
    public  viewCtrl: ViewController,
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
      this.showEditingReadOnlyDocumentsErrorToast();
      return;
    }

    document.selected = !document.selected;
    document.selected ? this.selectedDocCount++ : this.selectedDocCount--;
  }

  async openDocument(document: IDocument) {
    if (!document.file_path) {
      return this.documentsSyncClient.showSyncingToast();
    }
    this.util.setPluginPrefs()
    // open the PDF viewer
    let filename = document.file_path.split('/').pop();
    let documentFilePath = this.documentsFolder() + filename;
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

    const buttons: any = [
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
        text: 'Cancel',
        role: 'cancel',
      }
    ];

    this.popup.showActionSheet(
      'documents.how-to-send',
      buttons,
      this.selectedTheme.toString()
    );

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
    this.popup.showToast({text:'documents.open-error'})
  }

  private showEditingReadOnlyDocumentsErrorToast() {
    this.popup.showToast({text:'documents.edit-error'})
  }
}
