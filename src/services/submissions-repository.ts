
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { DBClient } from './db-client';
import { FormSubmission } from "../model";
import { SubmissionMapper } from "./submission-mapper";


@Injectable()
export class SubmissionsRepository {

  constructor(private dbClient: DBClient,
    private submMapper: SubmissionMapper) {
    //
  }

  public handleDeletedSubmissions(submissions) {
    let submissionsToDelete = [];
    submissions.forEach((submId) => {
      let submissionToDelete = new FormSubmission();
      submissionToDelete.id = submId;
      let deleteSubmObs = this.dbClient.deleteSubmission(submissionToDelete);
      submissionsToDelete.push(deleteSubmObs);
    });

    return Observable.zip(...submissionsToDelete);
  }

  public handleDeletedHoldSubmissions(submissions) {
    let submissionsToDelete = [];
    submissions.forEach((holdId) => {
      let submissionToDelete = new FormSubmission();
      submissionToDelete.hold_request_id = holdId;
      let deleteSubmObs = this.dbClient.deleteHoldSubmission(submissionToDelete);
      submissionsToDelete.push(deleteSubmObs);
    });

    return Observable.zip(...submissionsToDelete);
  }

  public handleMergedSubmission(activityId, localSubmission, mergedSubmission, form) {
    console.log('submission repo handle merge')
    return this.dbClient.getSubmissionById(activityId).flatMap((sub) => {
      if (sub) {
        //remove local submission with the same activityId
        return this.dbClient.deleteSubmission(sub);
      }
      return Observable.of({});
    }).flatMap(() => {
      if (mergedSubmission) {
        //remove the locally saved submission (that was submitted)
        return this.dbClient.deleteSubmission(localSubmission);
      }
      return Observable.of({});
    }).flatMap(() => {
      console.log('check merge')
      if (mergedSubmission) {
        return this.dbClient.saveSubmission(this.submMapper.map(form, mergedSubmission));
      }
      console.log('not merged submission');
      return this.dbClient.updateSubmissionId(localSubmission);
    })
  }
}
