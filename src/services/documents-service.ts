import { Injectable } from "@angular/core";
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {DBClient} from "./db-client";
import {RESTClient} from "./rest-client";
import {Observable} from "rxjs";
import {Util} from "../util/util";
import {FileUtils} from "../util/file";
import {IDocument} from "../model";
import {ToastController} from "ionic-angular";
import {forkJoin} from "rxjs/observable/forkJoin";

@Injectable()
export class DocumentsService {
  constructor(
    private fileService: File,
    private fileTransfer: FileTransfer,
    private dbClient: DBClient,
    private restClient: RESTClient,
    private util: Util,
    private toast: ToastController
  ) {}

  saveDocument(document: IDocument) {
    const fileTransferObject: FileTransferObject = this.fileTransfer.create();
    return new Observable<any>((obs) => {
      return this.getDocumentById(document.id).subscribe((doc) => {
        if (doc) {
          // check for changes here
          if (doc.preview_urls !== document.preview_urls || doc.vanity_url !== document.vanity_url) {
            this.updateDocument({
              ...doc,
              preview_urls: JSON.stringify(document.preview_urls),
              vanity_url: document.vanity_url
            }).subscribe((_) => {
              obs.next(document);
              obs.complete();
            }, (error) => obs.complete());
          }

          return obs.complete();
        }

        return this.restClient.getDocumentInfo(document.id).subscribe((data) => {
          if (data.status != "200") {
            return this.removeDocuments([document.id])
              .subscribe((_) => obs.complete(), (error) => obs.complete());
          }

          const documentFromTheAPI: IDocument | any = {...data.records[0], setId: document.setId};
          documentFromTheAPI.file_extension = FileUtils.getExtensionByType(documentFromTheAPI.file_type);
          documentFromTheAPI.vanity_url = document.vanity_url;

          if (documentFromTheAPI.preview_urls && typeof documentFromTheAPI.preview_urls !== 'string') {
            documentFromTheAPI.preview_urls = JSON.stringify(documentFromTheAPI.preview_urls);
          }

          const hasExtension = FileUtils.getFileExtension(documentFromTheAPI.name);
          const extension = hasExtension ? '' : '.' + documentFromTheAPI.file_extension;

          const filePath = this.getDocumentsDirectory() + documentFromTheAPI.name + extension;
          const adjustedPath = this.util.adjustFilePath(filePath);
          return fileTransferObject.download(documentFromTheAPI.download_url, adjustedPath)
            .then((entry) => {
              documentFromTheAPI.file_path = entry.toURL();
              return this.dbClient.saveDocument(documentFromTheAPI)
                .subscribe((ok) => {
                  obs.next(documentFromTheAPI);
                  obs.complete();
                  console.log('Document saved successfully');
                  console.log(JSON.stringify(ok));
                }, (error) => {
                  obs.error(error);
                  console.log(`Couldn't save document on the db`);
                  console.log(JSON.stringify(error));
                });

            }, (error) => {
              obs.error(error);
              console.log(`Couldn't save the document to the device`);
              console.log(JSON.stringify(error));
            });

        }, (error) => {
          obs.error(error);
          console.log(`Couldn't get document info from the webservice`);
          console.log(JSON.stringify(error));
        });
      });
    });
  }

  /**
   * Return a document form the database
   * @param id
   */
  getDocumentById(id: number): Observable<IDocument> {
    return new Observable<IDocument>((obs) => {
      this.dbClient.getDocumentsByIds([id]).subscribe((docs) => {
        if (!docs) {
          obs.next(null);
          obs.complete();
          return;
        }

        obs.next(docs[0]);
        obs.complete();
      }, (error) => {
        obs.error(false);
        console.log(`Couldn't get the document, an error occurred`);
        console.log(JSON.stringify(error));
      })
    });
  }

  getDocumentsByIds(ids: number[]): Observable<IDocument[]> {
    return new Observable<IDocument[]>((obs) => {
      this.dbClient.getDocumentsByIds(ids).subscribe((docs) => {
        obs.next(docs);
        obs.complete();
      }, (error) => {
        obs.error(false);
        console.log(`Couldn't get the document, an error occurred`);
        console.log(JSON.stringify(error));
      })
    });
  }

  getDocumentsBySet(setId: number): Observable<IDocument[]> {
    return new Observable<IDocument[]>((obs) => {
      this.dbClient.getDocumentsBySetId(setId).subscribe((docs) => {
        obs.next(docs);
        obs.complete();
      }, (error) => {
        obs.error(false);
        console.log(`Couldn't get the documents, an error occurred`);
        console.log(JSON.stringify(error));
      })
    });
  }

  updateDocument(document: IDocument) {
    return this.dbClient.updateDocument(document);
  }

  documentExists(id: number): Observable<boolean> {
    return new Observable<boolean>((obs) => {
      this.dbClient.getDocumentsByIds([id]).subscribe((docs) => {
        if (!docs) {
          obs.next(false);
          obs.complete();
          return;
        }

        obs.next(true);
        obs.complete();
      }, (error) => {
        obs.error(false);
        console.log(`Couldn't check for document existence, an error occurred`);
        console.log(JSON.stringify(error));
      })
    });
  }

  removeDocuments(ids: number[]): Observable<any> {
    return new Observable<any>((obs) => {
      this.dbClient.getDocumentsByIds(ids).subscribe(async (documents) => {
        if (!documents) {
          obs.next(true);
          obs.complete();
          return;
        }

        const toDeleteObservables = documents.map((doc) => {
          const fileName = doc.file_path.split('/').pop();
          return Observable
            .fromPromise(this.fileService.removeFile(this.getDocumentsDirectory(), fileName))
            .defaultIfEmpty({})
            .catch(() => Observable.of({}));
        });

        forkJoin(toDeleteObservables)
          .subscribe((data) => {

            this.dbClient.deleteDocuments(ids).subscribe((ok) => {
              obs.next(true);
              obs.complete();
            }, (error) => {
              obs.error(false);
              console.log(`Couldn't delete documents, an error occurred`);
              console.log(JSON.stringify(error));
            })

          }, (error) => {
            obs.error(false);
            console.log(`Couldn't delete documents, an error occurred`);
            console.log(JSON.stringify(error));
          })

      }, (error) => {
        obs.error(false);
        console.log(`Couldn't delete documents, an error occurred`);
        console.log(JSON.stringify(error));
      });
    });
  }

  removeAllDocuments(): Observable<any> {
    return this.dbClient.deleteAllDocuments();
  }

  public getDocumentsDirectory() {
    return this.fileService.dataDirectory + 'leadliaison/documents/';
  }

  showNoDocumentsToast() {
    let toaster = this.toast.create({
      message: `The selected documents set doesn't contains any documents.`,
      duration: 3000,
      position: "top",
      cssClass: "error"
    });

    toaster.present();
  }
}
