import {Component, Input, NgZone} from "@angular/core";
import {BaseElement} from "../base-element";
import {Form, FormElement, FormSubmission} from "../../../../model";
import {FormGroup} from "@angular/forms";
import {AudioCaptureService} from "../../../../services/audio-capture-service";
import {ThemeProvider} from "../../../../providers/theme/theme";
import {ActionSheetController} from "ionic-angular";
import {Popup} from "../../../../providers/popup/popup";
import {MEDIA_STATUS} from "@ionic-native/media";


@Component({
  selector: 'goc-audio',
  templateUrl: 'goc-audio.html'
})

export class GOCAudio extends BaseElement {

  @Input() element: FormElement;
  @Input() formGroup: FormGroup;
  @Input() readonly: boolean = false;

  @Input() form: Form;
  @Input() submission: FormSubmission;

  private selectedTheme;
  private isRecording = false;
  private isPlaying = false;

  private trackDuration = 0;
  private currentPosition = 0 //%;

  private audioTimer;
  private recordTimer;

  private filePath;

  private step = 0;

  private isSeeked = false;

  constructor(private audioCaptureService: AudioCaptureService,
              private themeProvider: ThemeProvider,
              private actionCtrl: ActionSheetController,
              private popup: Popup,
              private zone: NgZone) {
    super();

    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  startRecording() {
    this.trackDuration = 0;
    this.audioCaptureService.startRecord().then(result => {
      this.updateRecordDuration();
      this.isRecording = true;
      this.filePath = result;
    }, error => {
      this.isRecording = false;
      this.currentVal = '';
    });
  }

  stopRecording() {
    this.audioCaptureService.stopRecord();
    this.isRecording = false;
    this.currentVal = this.filePath;
    this.updateRecordDuration(true);
  }

  removeRecord() {
    this.removeAudio();
  }

  onSeek(event) {

    //invoking seek function directly is not working, need to be called from the playback function
    this.pausePlayback();
    this.currentPosition = event.value;
    this.isSeeked = true;
  }

  private updateRecordDuration(shouldStop?) {

    clearInterval(this.recordTimer);

    if (shouldStop) {
      return;
    }

    this.recordTimer = setInterval(x => {
      this.zone.run(() =>{
        this.trackDuration += 1;
      });
    }, 1000);
  }

  private updateAudioDuration(shouldStop?) {

    clearInterval(this.audioTimer);

    if (shouldStop) {
      this.zone.run(() =>{
        this.currentPosition = 0;
      });
      return;
    }

    this.audioTimer = setInterval(x => {
      if (this.isPlaying) {
        this.audioCaptureService.currentPosition().then(position => {
          this.zone.run(() =>{
            console.log(position);
            this.currentPosition = position / (this.trackDuration * 0.001) * 100;
          });
        })
      }
    }, this.step);
  }

  private startPlayback() {

    this.audioCaptureService.playRecord(this.currentVal).subscribe(status => {
      this.zone.run(() =>{
        this.isPlaying = (status == MEDIA_STATUS.RUNNING);

        let duration = this.audioCaptureService.trackDuration();
        if (duration != -1) {

          this.step = duration / 100;
          this.trackDuration = duration;

          this.updateAudioDuration(status == MEDIA_STATUS.STOPPED);

          if (this.isSeeked && this.isPlaying) {
            this.audioCaptureService.seek(this.currentPosition * this.trackDuration / 100);
            this.isSeeked = false;
          }
        }
      });
    });
  }

  private pausePlayback() {
    this.audioCaptureService.pausePlayback();
    this.isPlaying = false;
  }

  private removeAudio() {
    return new Promise((resolve, reject) => {
      this.audioCaptureService.removeRecord(this.currentVal)
        .then(result => {
          if (result) {
            console.log('Audio file was removed');
            this.currentVal = '';

            resolve(true);
          } else {
            resolve(false);
          }
        }).catch(error => {
        console.log('Audio file can\'t be removed');
        reject(error);
      })
    })
  }
}
