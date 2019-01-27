import {Injectable} from "@angular/core";

@Injectable()
export class StorageProvider {

  constructor() {
    //
  }

  uploadFile(url, fileBlob) {
    return Promise.resolve("filePath");
  };

}
