import {Modifiers} from "../../services/filter-service";

export enum FilterType {
  Email = 'email',
  Name = 'name',
  CaptureType = 'captureType',
  CapturedBy = 'capturedBy'
}


export class GCFilter {
  id: string;
  title: string;
  icon: string;
  selected?: string [];
  modifier?: Modifiers

  constructor() {
    //
  }
}
