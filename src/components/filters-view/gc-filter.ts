import {Modifier, Modifiers} from "../../services/filter-service";

export enum FilterType {
  Email = 'email',
  Name = 'name',
  CaptureType = 'captureType',
  CapturedBy = 'capturedBy',
  CaptureDate = 'capturedDate'
}


export class GCFilter {
  id: string;
  title: string;
  icon: string;
  selected?: string [];
  modifier?: Modifier;

  constructor() {
    //
  }
}
