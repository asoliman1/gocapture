export class SyncStatus{
	loading: boolean;
	complete?: boolean = false;
	formId: number;
	formName: string;

	constructor(loading?: boolean, complete?: boolean, formId?: number, formName?: string){
		this.loading = loading;
		this.complete = complete;
		this.formId = formId;
		this.formName = formName;
	}
}