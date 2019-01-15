import { Injectable } from "@angular/core";
import {Media, MEDIA_STATUS, MediaObject} from "@ionic-native/media";
import {File, RemoveResult} from '@ionic-native/file';
import {Observable} from "rxjs";
import {Platform} from "ionic-angular";
import {Util} from "../util/util";

@Injectable()

export class AudioCaptureService {

  audioFile: MediaObject;

  constructor(private media: Media,
              private fileService: File,
              private platform: Platform,
              private utils: Util) {
    //
  }

  startRecord(): Promise<string> {

    let audioFolder =  this.fileService.dataDirectory + "leadliaison/audio";

    let extension = this.platform.is("ios") ? ".m4a" : ".3gp";
    let audioName = new Date().getTime() + extension;
    let filePath = audioFolder + "/" + audioName;

    if (this.platform.is("ios")) {
      filePath = filePath.replace(/^file:\/\//, '');
    }

    return new Promise<string>((resolve, reject) => {
      if (this.platform.is("ios")) {
        this.fileService.createFile(audioFolder, audioName, true)
          .then(() => {
            this.audioFile = this.media.create(filePath);
            this.audioFile.startRecord();
            resolve(filePath);
          }).catch(error => {
          reject(error);
        });
      } else {
        this.audioFile = this.media.create(audioName);
        this.audioFile.startRecord();
        resolve(filePath);
      }
    });
  }

  stopRecord(filePath) {
    this.audioFile.stopRecord();

    if (this.platform.is("android")) {
      let audioFolder =  this.fileService.dataDirectory + "leadliaison/audio";
      this.utils.moveFile(this.fileService.externalDataDirectory + "/" + this.adjustPath(filePath), audioFolder)
        .subscribe((newPath) => {
          console.log(newPath);
      }, (err) => {
        console.error(err);
      })
    }

    this.audioFile.release();
  }

  playRecord(filePath): Observable<MEDIA_STATUS> {
    this.audioFile = this.media.create(this.adjustPath(filePath));
    this.audioFile.play();

    return this.audioFile.onStatusUpdate;
  }

  stopPlayback() {
    this.audioFile.stop();
    this.audioFile.release();
  }

  pausePlayback() {
    this.audioFile.pause();
  }

  removeRecord(filePath: string): Promise<RemoveResult> {
    if (filePath.length > 0) {
      let fileName = filePath.split('/').pop();
      let audioFolder = this.fileService.dataDirectory + "leadliaison/audio";
      return this.fileService.removeFile(audioFolder, fileName);
    }
    return Promise.reject({success: false, entry: null});
  }

  trackDuration() {
    return this.audioFile.getDuration() * 1000;
  }

  currentPosition(): Promise<any> {
    return this.audioFile.getCurrentPosition();
  }

  seek(value) {
    this.audioFile.seekTo(value);
  }

  private adjustPath(filePath) {
    if (this.platform.is("android")) {
      let pathComponents = filePath.split("/");
      return pathComponents[pathComponents.length - 1];
    }
    return filePath;
  }
}
