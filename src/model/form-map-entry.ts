import { SyncStatus, FormSubmission ,Form} from ".";

export class FormMapEntry {
    form: Form;
    urlFields: string[];
    status: SyncStatus;
    submissions: FormSubmission[];
  }