export class SyncStatus{
	loading: boolean;
	complete?: boolean = false;
	formId: number;
	formName: string;
	percent: number = 0;

	constructor(loading?: boolean, complete?: boolean, formId?: number, formName?: string, percent?: number){
		this.loading = loading;
		this.complete = complete;
		this.formId = formId;
		this.formName = formName;
		this.percent = percent > 0 ? percent : 0;
	}
}