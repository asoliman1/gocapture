import { Injectable } from "@angular/core";
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {DBClient} from "./db-client";

@Injectable()
export class DocumentsService {

  private fileTransfer: FileTransferObject;

  constructor(
    private fileService: File,
    private fTransfer: FileTransfer,
    private dbClient: DBClient
  ) {
    this.fileTransfer = fTransfer.create();
  }

  syncAll() {
    this.dbClient.getUnprocessedDocuments().subscribe((data) => {
      console.log('Got all unprocessed data, ', JSON.stringify(data));
      // TODO: call the save document here
      const promises = [];
      for (let i = 0; i < data.length; i++) {
        promises.push(this.saveDocument(data[i].id, data[i].name, data[i].url));
      }

      Promise.all(promises)
        .then((_) => {
          console.log('Documents synced successfully...');
        })
        .catch((err) => {
          console.log('An error occurred while syncing the documents...', JSON.stringify(err));
        })
    }, (error) => {
      console.log('Some error occurred with the data...', JSON.stringify(error));
    });
  }

  syncByForm(formId: string) {
    this.dbClient.getUnprocessedDocuments().subscribe((data) => {
      console.log('Got all unprocessed data, ', JSON.stringify(data));
      // TODO: call the save document here
      const promises = [];
      for (let i = 0; i < data.length; i++) {
        promises.push(this.saveDocument(data[i].id, data[i].name, data[i].url));
      }

      Promise.all(promises)
        .then((_) => {
          console.log('Documents synced successfully...');
        })
        .catch((err) => {
          console.log('An error occurred while syncing the documents...', JSON.stringify(err));
        })
    }, (error) => {
      console.log('Some error occurred with the data...', JSON.stringify(error));
    });
  }

  saveDocument(id: number, name: string, url: string) {
    const savePath = this.getDocumentsDirectory() + name;
    return this.fileTransfer.download(url, this.fileService.dataDirectory + savePath)
      .then((entry) => {
        const path = entry.toURL();
        this.dbClient.updateDocumentById(id, name, url, path);
        console.log('Document saved successfully ' + path);
      }, (error) => {
        this.dbClient.updateDocumentById(id, name, url, '', false);
        console.log("Document couldn't be saved: ", error);
      });
  }

  public getDocumentsDirectory() {
    return this.fileService.dataDirectory + 'leadliaison/documents/';
  }
}
