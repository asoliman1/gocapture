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

			this.popup.showAlert('alerts.error', {text:"alerts.audio-recording.cant-start"}, [{
				text: 'general.cancel',
				role: 'cancel'
			}], this.selectedTheme);
		});
	}

	stopRecording() {

		this.audioCaptureService.stopRecord().then((filePath) => {
			this.onProcessingEvent.emit('false');
			this.isRecording = false;
			this.onChange(filePath);
			this.updateRecordDuration(true);
			this.currentVal = filePath;
			console.log(filePath)
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
		return this.audioCaptureService.removeRecord(this.currentVal);
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

	async startPlayback() {

		let filePath = this.currentVal;
	
		if (filePath.startsWith('https://')) {
			this.popup.showLoading({text:"audio-recording.downloading"});
			await this.audioCaptureService.downloadRecord(filePath);
			this.popup.dismiss('loading');
		}

		this.audioCaptureService.init(filePath)
		this.audioCaptureService.getAudioStatus().subscribe(status => {
			this.zone.run(() => {
				this.isPlaying = (status == MEDIA_STATUS.RUNNING);
			})
			let counter = 0;
			let timerDur = setInterval(() => {
				counter = counter + 100;
				if (counter > 2000) {
					clearInterval(timerDur);
				}
				let duration = this.audioCaptureService.trackDuration();
				if (duration > 0) {
					clearInterval(timerDur);

					this.step = duration / 100;
					this.trackDuration = duration;

					this.updateAudioDuration(status == MEDIA_STATUS.STOPPED);

					if (this.isSeeked && this.isPlaying) {
						this.audioCaptureService.seek(this.currentPosition * this.trackDuration / 100);
						this.isSeeked = false;
					}
				}
			}, 100);

		});
		this.audioCaptureService.playRecord();
	}


	private pausePlayback() {
		this.audioCaptureService.pausePlayback();
		this.isPlaying = false;
	}

	ngOnDestroy() {
		this.audioCaptureService.stopPlayback();
	}

	private removeAudio() {

		const buttons = [
			{
				text: 'general.cancel',
				role: 'cancel',
				handler: () => {
				}
			},
			{
				text: 'general.remove',
				role: '',
				handler: () => {
					this.removeRecordingHandler();
				}
			}];

		this.popup.showAlert('alerts.warning', {text:"alerts.audio-recording.delete-recording"}, buttons);
	}

	removeRecordingHandler() {
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

	private updateTimeLabels(position, duration) {
		this.timeUp = position * duration / 100;
		this.timeDown = duration - position * duration / 100;
	}
}
