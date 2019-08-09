import { BaseGroupElement} from "../base-group-element";
import {ModalController, ToastController} from "ionic-angular";
import {DocumentShareMode} from "../../../../views/documents/documents";
import {Component, Input} from "@angular/core";
import {DocumentsService} from "../../../../services/documents-service";
import {FormElement, FormSubmission, SubmissionStatus} from "../../../../model";
import {DocumentsSyncClient} from "../../../../services/documents-sync-client";

@Component({
  selector: 'document',
  templateUrl: 'document.html'
})
export class Document extends BaseGroupElement {

  @Input() element: FormElement;
  @Input() shareMode: DocumentShareMode;
  @Input() isEditing?: boolean;
  @Input() submission?: FormSubmission;

  constructor(
    private modalCtrl: ModalController,
    private documentsService: DocumentsService,
    private documentsSyncClient: DocumentsSyncClient,
    private toast: ToastController
  ) {
    super();
  }

  isReadOnlyMode() {
    return !this.isEditing && this.submission &&
      (this.submission.status == SubmissionStatus.Submitted || this.submission.status == SubmissionStatus.Submitting);
  }

  ngOnChanges() {
    console.log(this.element);
  }

  openDocuments() {
    console.log("OPENING DOCUMENTS PAGE");
    console.log(JSON.stringify(this.submission));

    if (this.documentsSyncClient.isSyncing()) {
      this.documentsSyncClient.showSyncingToast();
      return;
    }

    this.documentsService.getDocumentsByIds(this.element.documents_set.documents.map((d) => d.id)).subscribe((documents) => {
      if (documents && documents.length) {
        this.element.documents_set.documents = documents;
      }

      this.prepareSelectedDocuments();

      const modal =  this.modalCtrl
        .create("Documents", {
          documentSet: this.element.documents_set,
          shareMode: this.shareMode,
          readOnly: this.isReadOnlyMode()
        });

      modal.onDidDismiss((data: number[]) => {
        console.log('Getting back data form the document', data ? JSON.stringify(data) : data);
        if (data && Array.isArray(data)) {
          this.element.documents_set.selectedDocumentIdsForSubmission = data;
        }
      });

      modal.present();

    }, (error) => {
      let toaster = this.toast.create({
        message: `A problem occurred while opening your documents. Please try again.`,
        duration: 3000,
        position: "top",
        cssClass: "error"
      });
      toaster.present();
    });
  }

  prepareSelectedDocuments() {
    const elementId = this.element.id;
    if (this.submission && this.submission.fields["element_" + elementId]) {
      try {
        if (!this.element.documents_set.selectedDocumentIdsForSubmission) {
          if (typeof this.submission.fields["element_" + elementId] === 'string') {
            this.element.documents_set.selectedDocumentIdsForSubmission = JSON.parse(this.submission.fields["element_" + elementId] as string);
          } else if (this.submission.fields["element_" + elementId]) {
            this.element.documents_set.selectedDocumentIdsForSubmission = this.submission.fields["element_" + elementId] as any;
          }
        }
      } catch (e) {
        console.log('Error while parsing the documents element');
        console.log(JSON.stringify(e));
      }

      this.element.documents_set.documents = this.element.documents_set.documents
        .map((document) => {
          if (this.element.documents_set.selectedDocumentIdsForSubmission.indexOf(document.id) !== -1) {
            document.selected = true;
          }

          return document;
        });
    }

    if (this.element.documents_set.selectedDocumentIdsForSubmission) {
      this.element.documents_set.documents = this.element.documents_set.documents
        .map((document) => {
          if (this.element.documents_set.selectedDocumentIdsForSubmission.indexOf(document.id) !== -1) {
            document.selected = true;
          }

          return document;
        });
    }
  }
}
