import { DbFile } from './../../model/dbFile';
import { DOWNLOAD_STATUS, DownloadStatus } from './../../constants/download-status';
import { DBClient } from './../../services/db-client';
import { HTTP } from '@ionic-native/http';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { Util } from '../../util/util';
import { File } from '@ionic-native/file';
import { from } from 'rxjs/observable/from';

@Injectable()
export class OfflineFilesProvider {

  private CurrentDownloadings: Map<string, Observable<string>> = new Map();

  constructor(private http: HTTP, private util: Util, private dbClient: DBClient, private file: File) {
    console.log('Hello OfflineFilesProvider Provider');
  }

  private addToCurrentDownloadings(key: string, obs: Observable<string>) {
    this.CurrentDownloadings.set(key, obs);
  }

  private rmFromCurrentDownloadings(key: string) {
    this.CurrentDownloadings.delete(key);
  }

  private downloadFile(file: DbFile): Observable<string> {
    let d: Observable<string> = from(this.http.downloadFile(file.downloadURL, {}, {}, file.path)).map((e) => e.nativeURL).share();
    this.addToCurrentDownloadings(file.id, d);
    return d;
  }

  private saveFile(file: DbFile) {
    this.downloadFile(file).subscribe((entry: string) => {
      file.status = DOWNLOAD_STATUS.DOWNLOADED;
      this.saveToDb(file);
    }, err => {
      file.status = DOWNLOAD_STATUS.FAILED;
      this.saveToDb(file);
      this.saveFile(file);
      console.log(err);
    });
  }

  private saveToDb(file: DbFile) {
    this.dbClient.saveFile(file).subscribe((data) => {
      if (file.status === DOWNLOAD_STATUS.DOWNLOADED)
        this.rmFromCurrentDownloadings(file.id);
    }, err => {
      console.log(err);
    });
  }

  private async rmFile(url: string, formId: number, type: string) {
    let file = this.getFilePath(url, formId, type);
    if (await this.rmFileStorage(`${this.file.dataDirectory}${file.folderPath}`, file.name)) {
      await this.rmFileDb(file.downloadURL).toPromise();
      return false;
    }
    else return false;
  }

  private async rmFileStorage(path: string, name: string) {
    try {
      let result = await this.file.removeFile(path, name);
      console.log(`File ${result.fileRemoved.name} removed.`);
      return true;
    } catch (error) {
      console.log(name);
      console.log(error);
      return false;
    }
  }

  private rmFileDb(url: string) {
    return this.dbClient.deleteFile(url);
  }

  checkFailedDownloads() {
    this.dbClient.getNonDownloadedFiles().subscribe((data) => {
      data.forEach((e) => this.saveFile(e))
    })
  }

  private getFileDb(id: string) {
    return this.dbClient.getFile(id);
  }

  getFile(id: string): Observable<string> {
    return new Observable(obs => {
      this.getFileDb(id).subscribe((data) => {
        if (data) {
          if (data.status === DOWNLOAD_STATUS.DOWNLOADED) {
            obs.next(this.file.dataDirectory + data.path);
            obs.complete();
          }
          else if (data.status === DOWNLOAD_STATUS.DOWNLOADING) {
            this.getFileQueue(id,obs);
          } else {
            obs.error("Failed to download file");
            obs.complete();
          }
        }
      })
    })
  }

 private getFileQueue(id : string , obs : Observer<string>) {
    this.CurrentDownloadings.get(id).subscribe((data) => {
      obs.next(data);
      obs.complete();
    }, err => {
      console.log(err);
      obs.error("Failed to download file");
      obs.complete();
    })
  }

  checkFile(downloadURL: string, formId: number, type: string, typeId: number) {
    let f = this.getFilePath(downloadURL, formId, type);
    if(this.CurrentDownloadings.get(this.getFileId(formId,type,typeId))) return;
    this.getFileDb(this.getFileId(formId, type, typeId)).subscribe((data) => {
      if (data) {
        if (data.downloadURL != downloadURL) {
          this.rmFile(f.downloadURL,formId,type).then((data)=>{
            console.log(data,'rm file promise');
            if(data)
            this.addFileToQueue(f.downloadURL, f.folderPath + f.name, formId, type, typeId, DOWNLOAD_STATUS.DOWNLOADING)
          })
        }
        else console.log('file already downloaded before');
      } else {
        this.addFileToQueue(f.downloadURL, f.folderPath + f.name, formId, type, typeId, DOWNLOAD_STATUS.DOWNLOADING)
      }
    })
  }

 private addFileToQueue(downloadURL: string, path: string, formId: number, type: string, typeId: number, status: DownloadStatus) {
    let file: DbFile = { downloadURL, path, formId, type, typeId, status, id: this.getFileId(formId, type, typeId) };
    this.saveToDb(file);
    this.saveFile(file);
  }

  // A.S
  private getFilePath(url: string, form: number, type: string) {
    if (url && url != '') {
      let name = url.substr(url.lastIndexOf("/") + 1).replace('.mp3','m4a'),
       downloadURL = encodeURI(url),
       folderPath = `leadliaison/`,
       fullPath = this.file.dataDirectory + folderPath + name;
       console.log(name)
      return { fullPath, downloadURL, name, form, folderPath }
    }
    else {
      return { fullPath: '', downloadURL: '', name: '', folder: '', folderPath: '' }
    }
  }

  public async deleteAllFiles() {
    try {
      let res = await this.deleteFolder("leadliaison", "");
      console.log('Removed all files ', res);
    } catch (error) {
      console.log('Remove all files')
      console.log(error);
    }
  }

  public async deleteFormFiles(formId: number) {
    try {
      let res = await this.deleteFolder(formId + '');
      console.log(`Removed form ${formId} files`, res);
    } catch (error) {
      console.log(`Remove form ${formId} files`);
      console.log(error);
    }
  }

  private async deleteFolder(folder: string, subPath = 'leadliaison/') {
    let path = this.file.dataDirectory + subPath;
    try {
      let result = await this.file.removeRecursively(path, folder);
      console.log(`Folder ${result.fileRemoved.name} removed`);
      return result
    } catch (error) {
      return error;
    }
  }

  public getFileId(formId: number, type: string, typeId: number) {
    return `${formId}-${type}-${typeId}`;
  }
}
