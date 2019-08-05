import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Form, IDocumentSet} from "../../model";
import {DocumentsService} from "../../services/documents-service";
import {DocumentsSyncClient} from "../../services/documents-sync-client";


@IonicPage()
@Component({
  selector: 'page-documents-list',
  templateUrl: 'documents-list.html',
})
export class DocumentsListPage {

  form: Form;
  documentSets: IDocumentSet[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modal: ModalController,
    private documentsService: DocumentsService,
    private documentsSync: DocumentsSyncClient,
    private toast: ToastController
  ) {
    this.form = this.navParams.get('form');
    this.init();
  }

  private init() {
    console.log(this.form);
    this.documentSets = this.form.elements
      .filter((el) => el.type === 'documents')
      .map((el) => {
        return {
          ...el.documents_set,
          formId: parseInt(this.form.id)
        }
      });
  }

  openDocuments(documentSet: IDocumentSet) {
    if (this.documentsSync.isSyncing()) {
      let toaster = this.toast.create({
        message: `Documents are still syncing please try again later.`,
        duration: 3000,
        position: "top",
        cssClass: "warning"
      });
      toaster.present();
      return;
    }

    this.documentsService.getDocumentsByIds(documentSet.documents.map((d) => d.id)).subscribe((documents) => {
      if (documents && documents.length) {
        documentSet.documents = documents;
      }

      this.modal.create("Documents", { documentSet }).present();
    }, (error) => {
      console.log('SOMETHING WENT WRONG OPENING THE DOCUMENT SET');
      console.log(JSON.stringify(error));

      let toaster = this.toast.create({
        message: `Something went wrong while opening the documents. Please try again later.`,
        duration: 3000,
        position: "top",
        cssClass: "error"
      });
      toaster.present();
    });
  }

}
