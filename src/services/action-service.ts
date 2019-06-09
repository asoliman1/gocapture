import { Injectable } from "@angular/core";
import {Subject} from "rxjs";

@Injectable()

export class ActionService {

  private actionSource: Subject<any> = new Subject();

  action = this.actionSource.asObservable();

  constructor() {
    //
  }

  performAction(action) {
    this.actionSource.next(action);

  }
}
