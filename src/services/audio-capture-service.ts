import { Injectable } from "@angular/core";
import {Media, MEDIA_STATUS, MediaObject} from "@ionic-native/media";
import {File, RemoveResult} from '@ionic-native/file';
import {Observable} from "rxjs";

@Injectable()

export class AudioCaptureService {

  audioFile: MediaObject;

  constructor(private media: Media, private fileService: File) {
    //
  }

  startRecord(): Promise<string> {

    let audioFolder = this.fileService.dataDirectory + "leadliaison/audio";
    let audioName = new Date().getTime() + '.m4a';
    let filePath = audioFolder + '/' + audioName;

    filePath = filePath.replace(/^file:\/\//, '');

    return new Promise<string>((resolve, reject) => {
      this.fileService.createFile(audioFolder, audioName, true)
        .then(() => {
          this.audioFile = this.media.create(filePath);
          this.audioFile.startRecord();
          resolve(filePath);
        }).catch(error => {
          reject(error);
      });
    });
  }

  stopRecord() {
    this.audioFile.stopRecord();
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
}
