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

  saveDocument(documentId: number, setId: number, share_link?: string) {
    const fileTransferObject: FileTransferObject = this.fileTransfer.create();
    return new Observable<any>((obs) => {
      return this.getDocumentById(documentId).subscribe((exists) => {
        if (exists) {
          return obs.complete();
        }

        return this.restClient.getDocumentInfo(documentId).subscribe((data) => {
          const document: IDocument|any = data.records[0];
          document.file_extension = FileUtils.getExtensionByType(document.file_type);
          document.thumbnail_path = document.thumbnail_path || '';
          document.setId = setId;

          const hasExtension = FileUtils.getFileExtension(document.name);
          const extension = hasExtension ? '' : '.' + document.file_extension;

          const filePath = this.getDocumentsDirectory() + document.name + extension;
          const adjustedPath = this.util.adjustFilePath(filePath);

          return fileTransferObject.download(document.download_url, adjustedPath)
            .then((entry) => {
              document.file_path = entry.toURL();
              document.vanity_url = share_link;

              return this.dbClient.saveDocument(document).subscribe((ok) => {
                obs.next(document);
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
      this.dbClient.deleteDocuments(ids).subscribe((ok) => {
        console.log('Documents deleted successfully');
        console.log(JSON.stringify(ok));
        obs.next(true);
        obs.complete();
      }, (error) => {
        obs.error(false);
        console.log(`Couldn't delete documents, an error occurred`);
        console.log(JSON.stringify(error));
      })
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
