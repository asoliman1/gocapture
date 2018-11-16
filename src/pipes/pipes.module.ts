import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from "./save-html/safe-html";
import { SubmissionStatusPipe } from './submission-status/submission-status';
import { FormControlPipe } from './form-control-pipe';
import { AvatarPathUpdaterPipe } from './avatar-path-updater';
import { ArrayFilterPipe } from './filter-pipe';
@NgModule({
	declarations: [
		SafeHtmlPipe,
		SubmissionStatusPipe, 
		FormControlPipe, 
		AvatarPathUpdaterPipe, 
		ArrayFilterPipe],
	imports: [],
	exports: [
		SafeHtmlPipe,
		SubmissionStatusPipe, 
		FormControlPipe, 
		AvatarPathUpdaterPipe, 
		ArrayFilterPipe
	]
})
export class PipesModule { }
