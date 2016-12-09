import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Observer } from "rxjs/Rx";
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';
import { SyncStatus, Form, Dispatch, DispatchOrder, DeviceFormMembership, FormSubmission } from "../model";

@Injectable()
export class SyncClient {

	private errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	private syncSource: BehaviorSubject<SyncStatus[]>;
    /**
     * Sync update event
     */
	onSync: Observable<SyncStatus[]>;

	private _isSyncing: boolean = false;

	private lastSyncStatus: SyncStatus[];

	constructor(private rest: RESTClient, private db: DBClient) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
		this.onSync = this.syncSource.asObservable();

	}

	public isSyncing(): boolean {
		return this._isSyncing;
	}

	public getLastSync(): SyncStatus[] {
		return this.lastSyncStatus;
	}

	public download(lastSyncDate: Date): Observable<DownloadData> {
		return new Observable<DownloadData>((obs: Observer<DownloadData>) => {
			let result = new DownloadData();
			this.rest.getAllForms(lastSyncDate).subscribe(forms => {
				result.forms = forms;
				this.db.saveForms(forms).subscribe(reply => {
					this.rest.getAllDeviceFormMemberships(forms, lastSyncDate).subscribe((contacts) => {
						result.memberships = contacts;
						this.db.saveMemberships(contacts).subscribe(res => {
							this.rest.getAllDispatches(lastSyncDate).subscribe(dispatches => {
								console.log(dispatches)
								result.dispatches = dispatches;
								let orders: DispatchOrder[] = [];
								let forms: Form[] = [];
								dispatches.forEach(dispatch => {
									orders.push.apply(orders, dispatch.orders);
									dispatch.forms.forEach(f => {
										if(forms.filter((form)=>{return form.form_id == f.form_id}).length == 0){
											forms.push(f);
										}
									});
								});
								orders.forEach(order => {
									order.form = forms.filter(f => {return f.form_id == order.form_id})[0];
								});
								console.log(orders);
								this.db.saveDispatches(orders).subscribe(reply => {
									obs.next(result);
									obs.complete();
								});
							}, err => {
								obs.error(err);
							});
						}, err => {
							obs.error(err);
						});
					}, err => {
						obs.error(err);
					});
				}, err => {
					obs.error(err);
				});
			}, err => {
				obs.error(err);
			});
		});
	}

	public sync(submissions: FormSubmission[], forms: Form[]): Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>( obs =>{
			this._isSyncing = true;
			var result = [];
			var map: {
				[key: number]: {
					form: Form, 
					status: SyncStatus,
					submissions: FormSubmission[]
				}
			} = {};
			this.lastSyncStatus = [];
			forms.forEach(form => {
				map[form.form_id] = {
					form: form,
					submissions: [],
					status: new SyncStatus(false, false, form.form_id, form.name)
				};
				this.lastSyncStatus.push(map[form.form_id].status);
			});
			submissions.forEach(sub => {
				map[sub.form_id].submissions.push(sub);
			});
			
			let formIds = Object.keys(map);
			let index = 0;
			map[formIds[index]].status.loading = true;
			this.syncSource.next(this.lastSyncStatus);
			let handler = (submitted : FormSubmission[]) => {
				result.push.apply(result, submitted);
				map[formIds[index]].status.complete = true;
				map[formIds[index]].status.loading = false;
				this.syncSource.next(this.lastSyncStatus);
				index++;
				if(index >= formIds.length){
					this._isSyncing = false;
					obs.next(result);
					obs.complete();
					this.syncSource.complete();
					return;
				}
				this.rest.submitForms(map[formIds[index]].submissions).subscribe(handler);
			};
			this.rest.submitForms(map[formIds[index]].submissions).subscribe(handler);
		});
	}
}

export class DownloadData {
	forms: Form[];
	dispatches: Dispatch[];
	memberships: DeviceFormMembership[];
}