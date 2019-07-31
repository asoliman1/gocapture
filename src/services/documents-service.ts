import { Injectable } from "@angular/core";
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {DBClient} from "./db-client";
import {RESTClient} from "./rest-client";
import {Observable} from "rxjs";
import {Util} from "../util/util";
import {FileUtils} from "../util/file";

@Injectable()
export class DocumentsService {
  constructor(
    private fileService: File,
    private fileTransfer: FileTransfer,
    private dbClient: DBClient,
    private restClient: RESTClient,
    private util: Util
  ) {}

  syncAll() {
    this.dbClient.getForms().subscribe((forms) => {
      console.log('Got all unprocessed data, ', JSON.stringify(forms));
    }, (error) => {
      console.log('Some error occurred with the data...', JSON.stringify(error));
    });
  }

  syncByForm(formId: number) {
    this.dbClient.getFormsByIds([formId]).subscribe((forms) => {
      console.log('Got all unprocessed data, ', JSON.stringify(forms));
    }, (error) => {
      console.log('Some error occurred with the data...', JSON.stringify(error));
    });
  }

  saveDocument(id: number) {
    const fileTransferObject: FileTransferObject = this.fileTransfer.create();

    return new Observable<any>((obs) => {
      this.restClient.getDocumentInfo(id).subscribe((data) => {
        const document = data.records[0];
        const filePath = this.getDocumentsDirectory() + document.name + '.' + FileUtils.getExtensionByType(document.file_type);
        const adjustedPath = this.util.adjustFilePath(filePath);

        // return this.fileService.checkFile(adjustedPath, document.name + '.' + FileUtils.getExtensionByType(document.file_type));
        return fileTransferObject.download(document.download_url, adjustedPath)
          .then((entry) => {
            const path = entry.toURL();
            this.dbClient.updateDocumentById(id, name, document.download_url, path);
            console.log('Document saved successfully ' + path);
            obs.next(path);
            obs.complete();
          }, (error) => {
            // this.dbClient.updateDocumentById(id, name, document.download_url, '', false);
            console.log("Document couldn't be saved: ", error);
            obs.error(error);
          });
      }, (error) => {
        obs.error(error);
        console.log(`DOCUMENT COULDN'T BE DOWNLOADED `, JSON.stringify(error));
      });
    });
  }

  public getDocumentsDirectory() {
    return this.fileService.dataDirectory + 'leadliaison/documents/';
  }
}
