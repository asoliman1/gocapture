import {Component, forwardRef, Input, NgZone} from "@angular/core";
import {BaseElement} from "../base-element";
import {Form, FormElement, FormSubmission} from "../../../../model";
import {FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AudioCaptureService} from "../../../../services/audio-capture-service";
import {ThemeProvider} from "../../../../providers/theme/theme";
import {ActionSheetController} from "ionic-angular";
import {Popup} from "../../../../providers/popup/popup";
import {MEDIA_STATUS} from "@ionic-native/media";


@Component({
  selector: 'goc-audio',
  templateUrl: 'goc-audio.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GOCAudio), multi: true }
  ]
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
  private currentPosition = 0;//%

  private audioTimer;
  private recordTimer;

  private step = 0;

  private isSeeked = false;

  private timeUp;
  private timeDown;

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
    this.audioCaptureService.startRecord().subscribe(status => {
      if (status == MEDIA_STATUS.RUNNING) {
        this.updateRecordDuration();
        this.isRecording = true;
      }
    }, error => {
      this.popup.showAlert('Error', "Can't start recording", [{text: 'Cancel',
        role: 'cancel'}], this.selectedTheme);
    });
  }

  stopRecording() {
    this.audioCaptureService.stopRecord().then(filePath => {
      this.isRecording = false;
      this.currentVal = filePath;
      this.updateRecordDuration(true);
    });
  }

  removeRecord() {
    this.removeAudio();
  }

  onSeek(event) {

    //invoking seek function directly is not working, need to be called from the playback function
    this.pausePlayback();
    this.currentPosition = event.value;
    this.isSeeked = true;
    this.updateTimeLabels(this.currentPosition, this.trackDuration)
  }

  private updateRecordDuration(shouldStop?) {

    clearInterval(this.recordTimer);

    if (shouldStop) {
      return;
    }

    this.recordTimer = setInterval(x => {
      this.zone.run(() =>{
        this.trackDuration += 1000;
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
            this.currentPosition = position / (this.trackDuration * 0.001) * 100;
            this.updateTimeLabels(this.currentPosition, this.trackDuration);
          });
        })
      }
    }, this.step);
  }

  private startPlayback() {

    this.audioCaptureService.playRecord(this.currentVal).subscribe(status => {
      this.isPlaying = (status == MEDIA_STATUS.RUNNING);

      let duration = this.audioCaptureService.trackDuration();

      if (duration > 0) {

        this.step = duration / 100;
        this.trackDuration = duration;

        this.updateAudioDuration(status == MEDIA_STATUS.STOPPED);

        if (this.isSeeked && this.isPlaying) {
          this.audioCaptureService.seek(this.currentPosition * this.trackDuration / 100);
          this.isSeeked = false;
        }
      }
    });
  }

  private pausePlayback() {
    this.audioCaptureService.pausePlayback();
    this.isPlaying = false;
  }

  private removeAudio() {

    const buttons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Remove',
        role: '',
        handler: () => {
          this.audioCaptureService.removeRecord(this.currentVal)
            .then(result => {
              if (result) {
                console.log('Audio file was removed');
                this.currentVal = '';
              }
            }).catch(error => {
            console.log('Audio file can\'t be removed');
          });
        }
      }];

    this.popup.showAlert('Warning', "Do you want to delete the record?", buttons, this.selectedTheme);
  }

  private updateTimeLabels(position, duration) {
    this.timeUp = position * duration / 100;
    this.timeDown = duration - position * duration / 100;
  }
}
