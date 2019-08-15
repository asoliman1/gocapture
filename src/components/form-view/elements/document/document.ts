import {ModalController, ToastController} from "ionic-angular";
import {DocumentShareMode} from "../../../../views/documents/documents";
import {Component, forwardRef, Input} from "@angular/core";
import {DocumentsService} from "../../../../services/documents-service";
import {Form, FormElement, FormSubmission, SubmissionStatus} from "../../../../model";
import {BaseElement} from "../base-element";
import {FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ThemeProvider} from "../../../../providers/theme/theme";

@Component({
  selector: 'document',
  templateUrl: 'document.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Document), multi: true }
  ]
})
export class Document extends BaseElement {
  @Input() form: Form;
  @Input() formGroup: FormGroup;
  @Input() readonly: boolean = false;

  @Input() element: FormElement;
  @Input() shareMode: DocumentShareMode;
  @Input() isEditing?: boolean;
  @Input() submission?: FormSubmission;

  private selectedThemeColor: string;

  constructor(
    private modalCtrl: ModalController,
    private documentsService: DocumentsService,
    private toast: ToastController,
    private themeService: ThemeProvider
  ) {
    super();
    this.themeService.getActiveTheme().subscribe((theme: string) => this.selectedThemeColor = theme.split('-')[0]);
  }

  isReadOnlyMode() {
    return !this.isEditing && this.submission &&
      (this.submission.status == SubmissionStatus.Submitted || this.submission.status == SubmissionStatus.Submitting);
  }

  ngOnChanges() {
    console.log(this.element);
  }

  openDocuments() {
    if (!this.element.documents_set) {
      return this.documentsService.showNoDocumentsToast();
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

          if (this.shareMode === DocumentShareMode.SUBMISSION) {
            data.length ? this.onChange(data) : this.onChange(null);
          }
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
        let selectedDocs = [];
        if (!this.element.documents_set.selectedDocumentIdsForSubmission) {
          if (typeof this.submission.fields["element_" + elementId] === 'string') {
            selectedDocs = JSON.parse(this.submission.fields["element_" + elementId] as string);
          } else if (this.submission.fields["element_" + elementId]) {
            selectedDocs = this.submission.fields["element_" + elementId] as any;
          }
        } else {
          selectedDocs = this.element.documents_set.selectedDocumentIdsForSubmission;
        }

        this.element.documents_set.documents = this.element.documents_set.documents
          .map((document) => {
            if (selectedDocs.indexOf(document.id) !== -1) {
              document.selected = true;
            }

            return document;
          });
      } catch (e) {
        console.log('Error while parsing the documents element');
        console.log(JSON.stringify(e));
      }
    }
    else if (this.element.documents_set.selectedDocumentIdsForSubmission) {
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
