
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { DBClient } from './db-client';
import {FormSubmission} from "../model";


@Injectable()
export class SubmissionsRepository {

  constructor(private dbClient: DBClient) {

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

}
