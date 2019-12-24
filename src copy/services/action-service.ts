import { Injectable } from "@angular/core";
import {Subject} from "rxjs";

@Injectable()

export class ActionService {

  private performActionSource: Subject<any> = new Subject();
  private completedActionSource: Subject<any> = new Subject();
  private intermediaryCompletedActionSource: Subject<any> = new Subject();

  actionStart = this.performActionSource.asObservable();
  actionComplete = this.completedActionSource.asObservable();
  actionCompleteIntermediary = this.intermediaryCompletedActionSource.asObservable();


  constructor() {
    //
  }

  performAction(action) {
    this.performActionSource.next(action);
  }

  completeAction(action) {
    this.completedActionSource.next(action);
  }
}
