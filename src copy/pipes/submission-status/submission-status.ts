import { Pipe, PipeTransform } from '@angular/core';
import {FormSubmission, SubmissionStatus} from "../../model";


@Pipe({
  name: 'submissionStatusPipe',
})
export class SubmissionStatusPipe implements PipeTransform {

  transform(submission: FormSubmission, ...args) {
    switch (submission.status) {
      case SubmissionStatus.Submitted: {
        return "Prospect uploaded successfully."
      }
      case SubmissionStatus.ToSubmit: {
        return "Prospect ready for upload. Tap on the cloud in the top-right corner of the screen to upload it. Tap on the blue icon next to the submission to block it from being uploaded."
      }
      case SubmissionStatus.OnHold: {
        return "Prospect pending transcription. Please standby.";
      }
      case SubmissionStatus.Blocked: {
        return "Prospect blocked from upload. Tap the red circle to unblock it."
      }
      default: {
        return ""
      }
    }
  }


}
