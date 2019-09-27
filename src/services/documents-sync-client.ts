import { Injectable } from "@angular/core";
import { DBClient } from "./db-client";
import { DocumentsService } from "./documents-service";
import { Form, IDocument, IDocumentSet } from "../model";
import { xorBy, intersectionBy, differenceBy } from 'lodash';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from "rxjs";
import { Popup } from "../providers/popup/popup";

@Injectable()
export class DocumentsSyncClient {
  private _isSyncing: boolean = false;

  constructor(
    private dbClient: DBClient,
    private documentsService: DocumentsService,
    private popup: Popup,
  ) { }

  async syncAll() {
    // don't call again if we are already syncing
    if (this._isSyncing) {
      return;
    }
console.log('Start syncing docs')
    return this.dbClient.getForms().subscribe(async (forms) => {
      if (forms.length) {
        this._isSyncing = true;
      }
      const documentSets = {};
      let currentDocuments = [];

      for (let i = 0; i < forms.length; i++) {
        forms[i].elements.forEach((el) => {
          if (el.type === 'documents' && el.documents_set) {
            documentSets[el.documents_set.id] = el.documents_set.documents;
            currentDocuments = currentDocuments
              .concat(
                el.documents_set.documents.map((doc) => { return { ...doc, setId: el.documents_set.id }; })
              );
          }
        })
      }

      // console.log('DOCUMENTS FROM FORMS');
      // console.log(currentDocuments);

      Object.keys(documentSets).forEach((setId) => {
        this.documentsService.getDocumentsBySet(parseInt(setId))
          .subscribe((documents) => {
            if (!documents) {
              documents = [];
            }

            const currentSetDocuments = documents.map((doc) => doc);
            // console.log('DOCUMENTS FROM DB');
            // console.log(currentSetDocuments);

            // console.log('document ids fetched from the webservice');
            // console.log(JSON.stringify(currentDocuments));

            // console.log('current set document ids fetched from database');
            // console.log(JSON.stringify(currentDocuments));

            // check only a small portion of the documents
            const documentsToBeChecked = xorBy(currentSetDocuments, currentDocuments, 'id');
            // documents to be deleted
            const documentsToBeDeleted = intersectionBy(currentSetDocuments, documentsToBeChecked, 'id');
            // documents to be inserted
            const documentsToBeInserted = differenceBy(documentsToBeChecked, documentsToBeDeleted, 'id');

            // console.log("DOCUMENTS TO BE DELETED => ");
            // console.log(JSON.stringify(documentsToBeDeleted));
            // console.log("DOCUMENTS TO BE INSERTED => ");
            // console.log(JSON.stringify(documentsToBeInserted));

            if (documentsToBeDeleted.length) {
              this.documentsService.removeDocuments(documentsToBeDeleted.map((doc) => doc.id))
                .subscribe(() => {
                  console.log('deleting success');
                }, (error) => {
                  console.log('deleting error');
                  console.log(JSON.stringify(error)
                  )
                });
            }

            if (documentsToBeInserted.length) {
              const documentObservables = documentsToBeInserted
                .map((doc: IDocument) => {
                  return this.documentsService.saveDocument(doc)
                    .defaultIfEmpty({})
                    .retry(3)
                    .catch(() => Observable.of({}));
                });

              forkJoin(documentObservables)
                .subscribe(() => {
                  // console.log('ALL DOCUMENTS SYNCED');
                  this._isSyncing = false;
                }, (error) => {
                  // console.log('DOCUMENTS COULDNT BE SYNCED');
                  this._isSyncing = false;
                })
            }

            if (!documentsToBeInserted.length && !documentsToBeDeleted.length) {
              this._isSyncing = false;
            }

          }, (error) => {
            console.log('Error while syncing by form');
            console.log(JSON.stringify(error));
            this._isSyncing = false;
          });

      })
    }, (error) => this._isSyncing = false);
  }

  syncBySet(set: IDocumentSet) {
    const promises = set.documents.map((document) => {
      return new Promise((resolve, reject) => {
        this.documentsService.saveDocument(document)
          .subscribe((_) => {
            resolve();
            console.log(`Document synced`);
          }, (error) => {
            reject(error);
            console.log(`Couldn't sync by set. An error occurred`);
            console.log(JSON.stringify(error));
          })
      });
    });

    return Promise.all(promises);
  }

  public isSyncing(): boolean {
    return this._isSyncing;
  }

  public showSyncingToast() {
   this.popup.showToast(`Documents are still syncing. Please try again later.`);
  }

  private getDocumentsSetByForm(form: Form): IDocumentSet[] {
    return form.elements
      .filter((el) => el.type === 'documents')
      .map((el) => {
        return {
          ...el.documents_set,
          formId: parseInt(form.id)
        }
      });
  }
}
