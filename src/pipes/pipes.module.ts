import { NgModule } from '@angular/core';
import { SaveHtmlPipe } from './save-html/save-html';
import { SubmissionStatusPipe } from './submission-status/submission-status';
@NgModule({
	declarations: [SaveHtmlPipe,
    SubmissionStatusPipe],
	imports: [],
	exports: [SaveHtmlPipe,
    SubmissionStatusPipe]
})
export class PipesModule {}
