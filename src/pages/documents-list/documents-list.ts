import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Form, IDocumentSet} from "../../model";
import {DocumentsService} from "../../services/documents-service";
import {ThemeProvider} from "../../providers/theme/theme";
import {unionBy} from 'lodash';
import { Popup } from '../../providers/popup/popup';

@IonicPage()
@Component({
  selector: 'page-documents-list',
  templateUrl: 'documents-list.html',
})
export class DocumentsListPage {

  form: Form;
  documentSets: IDocumentSet[];

  private selectedThemeColor: string;
  private selectedTheme: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modal: ModalController,
    private documentsService: DocumentsService,
    private popup: Popup,
    private themeService: ThemeProvider
  ) {
    this.form = this.navParams.get('form');
    this.init();
  }

  private init() {
    this.documentSets = this.form.elements
      .filter((el) => el.type === 'documents' && el.documents_set)
      .map((el) => {
        return {
          ...el.documents_set,
          formId: parseInt(this.form.id)
        }
      });

    this.themeService.getActiveTheme().subscribe((theme: string) => {
      this.selectedTheme = theme;
      this.selectedThemeColor = theme.split('-')[0]
    });
  }

  openDocuments(documentSet: IDocumentSet) {
    this.documentsService.getDocumentsByIds(documentSet.documents.map((d) => d.id)).subscribe((documents) => {
      if (documents && documents.length) {
        documentSet.documents = unionBy(documents, documentSet, 'id');
      }

      this.modal.create("Documents", { documentSet }).present();
    }, (error) => {
      console.log('SOMETHING WENT WRONG OPENING THE DOCUMENT SET');
      console.log(JSON.stringify(error));

     this.popup.showToast({text : `documents.open-problem`})
    });
  }

}
