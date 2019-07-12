import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Util} from "../../util/util";
import {ThemeProvider} from "../../providers/theme/theme";
import {IDocument, IDocumentCategory} from "../../model";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public util: Util,
    private actionSheetCtrl: ActionSheetController,
    private themeProvider: ThemeProvider
  ) {
    this.documentsSource = this.navParams.get('documentSource');
    this.selectedDocuments = [];
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  select(document: IDocument) {
    document.selected = !document.selected;
    this.selectedDocuments[document.name] = document.selected;
    console.log(this.selectedDocuments);
  }

  openDocument(document: string) {
    console.log("OPEN THE DOCUMENT FUNCTIONALITY HERE");
  }

  send() {
    console.log("Send documents");

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
