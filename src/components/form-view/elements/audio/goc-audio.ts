import { Component, forwardRef, Input, NgZone } from "@angular/core";
import { BaseElement } from "../base-element";
import { Form, FormElement, FormSubmission } from "../../../../model";
import { FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AudioCaptureService } from "../../../../services/audio-capture-service";
import { ThemeProvider } from "../../../../providers/theme/theme";
import { Content } from "ionic-angular";
import { Popup } from "../../../../providers/popup/popup";
import { MEDIA_STATUS } from "@ionic-native/media";


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

	selectedTheme;
	isRecording = false;
  isRecordingPaused = false;
	isPlaying = false;

	trackDuration = 0;
	currentPosition = 0;//%

	private audioTimer;
	private recordTimer;

	private step = 0;

	private isSeeked = false;

	timeUp;
	timeDown;

	constructor(private audioCaptureService: AudioCaptureService,
		private themeProvider: ThemeProvider,
		private popup: Popup,
		private zone: NgZone,
		private content: Content) {
		super();

		this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
	}

	startRecording() {
		this.onProcessingEvent.emit('true');
		this.trackDuration = 0;
		this.audioCaptureService.startRecord().subscribe((status) => {
      this.isRecordingPaused = status == MEDIA_STATUS.PAUSED;
			if (status == MEDIA_STATUS.RUNNING) {
				this.updateRecordDuration();
				this.isRecording = true;
			}
			if (this.isRecordingPaused) {
			  this.updateRecordDuration(true);
      }
		}, (error) => {
		this.onProcessingEvent.emit('false');

			this.popup.showAlert('Error', "Can't start recording", [{
				text: 'Cancel',
				role: 'cancel'
			}], this.selectedTheme);
		});
	}

	stopRecording() {

		this.audioCaptureService.stopRecord().then(filePath => {
			this.onProcessingEvent.emit('false');
			this.isRecording = false;
			this.onChange([filePath]);
			this.updateRecordDuration(true);

			this.updateTimeLabels(0, this.trackDuration);
		});
	}

	pauseRecording() {
	  this.isRecordingPaused = true;
    this.audioCaptureService.pauseRecord();
  }

  resumeRecording() {
    this.isRecordingPaused = false;
    this.audioCaptureService.resumeRecord();
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

	releaseResources() {
		super.releaseResources();
		return this.audioCaptureService.removeRecord(this.currentVal[0]);
	}


	private updateRecordDuration(shouldStop?) {

		clearInterval(this.recordTimer);

		if (shouldStop) {
			return;
		}

		this.recordTimer = setInterval((x) => {
			this.zone.run(() => {
				this.trackDuration += 1000;
			});
		}, 1000);
	}

	hasValue() {
		return this.currentVal && this.currentVal.length > 0;
	}

	private updateAudioDuration(shouldStop?) {

		clearInterval(this.audioTimer);

		if (shouldStop) {
			this.zone.run(() => {
				this.currentPosition = 0;
			});
			return;
		}

		this.audioTimer = setInterval(x => {
			if (this.isPlaying) {
				this.audioCaptureService.currentPosition().then(position => {
					this.zone.run(() => {
						this.currentPosition = position / (this.trackDuration * 0.001) * 100;
						this.updateTimeLabels(this.currentPosition, this.trackDuration);
					});
				})
			}
		}, this.step);
	}

	startPlayback() {

		let filePath = typeof this.currentVal === 'object' ? this.currentVal[0] : this.currentVal;

		this.audioCaptureService.playRecord(filePath).subscribe(status => {
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
					this.releaseResources().then(result => {
						if (result) {
							console.log('Audio file was removed');
							this.onChange(null);
							this.content.resize();
						}
					}).catch(error => {
						console.log('Audio file can\'t be removed');
					});
				}
			}];

		this.popup.showAlert('Warning', "Do you want to delete the recording?", buttons, this.selectedTheme);
	}

	private updateTimeLabels(position, duration) {
		this.timeUp = position * duration / 100;
		this.timeDown = duration - position * duration / 100;
	}
}
