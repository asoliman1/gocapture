import { Pipe, PipeTransform } from '@angular/core';
import {FormSubmission, SubmissionStatus} from "../../model";


@Pipe({
  name: 'submissionStatusPipe',
})
export class SubmissionStatusPipe implements PipeTransform {

  transform(submission: FormSubmission, ...args) {
    switch (submission.status) {
      case SubmissionStatus.Submitted: {
        return "submission-status.submitted"
      }
      case SubmissionStatus.ToSubmit: {
        return "submission-status.to-submit"
      }
      case SubmissionStatus.OnHold: {
        return "submission-status.on-hold";
      }
      case SubmissionStatus.Blocked: {
        return "submission-status.blocked"
      }
      default: {
        return ""
      }
    }
  }


}
