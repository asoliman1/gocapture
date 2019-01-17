import { Injectable } from "@angular/core";
import {Media, MEDIA_STATUS, MediaObject} from "@ionic-native/media";
import {File, RemoveResult} from '@ionic-native/file';
import {Observable} from "rxjs";
import {Platform} from "ionic-angular";
import {Util} from "../util/util";

@Injectable()

export class AudioCaptureService {

  audioFile: MediaObject;

  fileName: string;

  constructor(private media: Media,
              private fileService: File,
              private platform: Platform,
              private utils: Util) {
    //
  }

  startRecord(): Observable<MEDIA_STATUS> {

    let audioFolder =  this.fileService.dataDirectory + "leadliaison/audio";

    let extension = this.platform.is("ios") ? ".m4a" : ".3gp";
    this.fileName = new Date().getTime() + extension;

    let filePath = audioFolder + "/" + this.fileName;

    if (this.platform.is("ios")) {
      filePath = filePath.replace(/^file:\/\//, '');
    }

    if (this.platform.is("ios")) {
      this.fileService.createFile(audioFolder, this.fileName, true)
        .then(() => {
          this.startAudioRecording(filePath);
        }).catch(error => {
        console.error("Error - " + error)
      });
    } else {
      return this.startAudioRecording(this.fileName);
    }
  }

  stopRecord(): Promise<string> {
    this.audioFile.stopRecord();
    return new Promise<string>((resolve, reject) => {
      if (this.platform.is("android")) {
        this.utils.moveFile(this.fileService.externalRootDirectory + this.fileName, this.audioFolder())
          .subscribe((path) => {
            this.audioFile.release();
            return resolve(path);
          }, (err) => {
            console.error(err);
            reject(err);
          })
      } else {
        resolve(this.audioFolder() + this.fileName);
      }
    })
  }

  playRecord(filePath): Observable<MEDIA_STATUS> {
    this.audioFile = this.media.create(filePath);
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

  private startAudioRecording(filePath) {
    this.audioFile = this.media.create(filePath);
    this.audioFile.startRecord();
    return this.audioFile.onStatusUpdate;
  }

  private audioFolder(): string {
    return this.fileService.dataDirectory + "leadliaison/audio";
  }
}
