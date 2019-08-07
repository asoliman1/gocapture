import { BaseGroupElement} from "../base-group-element";
import {ModalController, ToastController} from "ionic-angular";
import {DocumentShareMode} from "../../../../views/documents/documents";
import {Component, Input} from "@angular/core";
import {DocumentsService} from "../../../../services/documents-service";
import {FormElement} from "../../../../model";
import {DocumentsSyncClient} from "../../../../services/documents-sync-client";

@Component({
  selector: 'document',
  templateUrl: 'document.html'
})
export class Document extends BaseGroupElement {

  @Input() element: FormElement;
  @Input() shareMode: DocumentShareMode;

  constructor(
    private modalCtrl: ModalController,
    private documentsService: DocumentsService,
    private documentsSyncClient: DocumentsSyncClient,
    private toast: ToastController
  ) {
    super();
  }

  ngOnChanges() {
    console.log(this.element);
  }

  openDocuments() {
    console.log("OPENING DOCUMENTS PAGE...", this.element, this.shareMode);

    if (this.documentsSyncClient.isSyncing()) {
      this.documentsSyncClient.showSyncingToast();
      return;
    }

    this.documentsService.getDocumentsByIds(this.element.documents_set.documents.map((d) => d.id)).subscribe((documents) => {
      if (documents && documents.length) {
        this.element.documents_set.documents = documents;
      }

      const modal =  this.modalCtrl
        .create("Documents", { documentSet: this.element.documents_set, shareMode: this.shareMode });

      modal.onDidDismiss((data: number[]) => {
        if (data) {
          this.element.documents_set.selectedDocumentIdsForSubmission = data;
        }
      });

      modal.present();

    }, (error) => {
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
