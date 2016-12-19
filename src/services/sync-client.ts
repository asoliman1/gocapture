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
			var map: {[key: string] : SyncStatus} = {
				forms: new SyncStatus(true, false, 0, "Forms", 10),
				contacts: new SyncStatus(false, false, 0, "Contacts", 0),
				dispatches: new SyncStatus(false, false, 0, "Dispatches", 0),
			}
			this._isSyncing = true;
			this.lastSyncStatus = [
				map["forms"],
				map["contacts"],
				map["dispatches"]
			];
			this.syncSource.next(this.lastSyncStatus);
			this.rest.getAllForms(lastSyncDate).subscribe(forms => {
				result.forms = forms;
				map["forms"].percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveForms(forms).subscribe(reply => {
					map["forms"].complete = true;
					map["forms"].loading = false;
					map["forms"].percent = 100;
					map["contacts"].loading = true;
					map["contacts"].percent = 10;
					this.syncSource.next(this.lastSyncStatus);
					this.rest.getAllDeviceFormMemberships(forms, lastSyncDate).subscribe((contacts) => {
						result.memberships.push.apply(result.memberships, contacts);
						map["contacts"].percent = 50;
						this.syncSource.next(this.lastSyncStatus);
						this.db.saveMemberships(contacts).subscribe(res => {
							map["contacts"].complete = true;
							map["contacts"].loading = false;
							map["contacts"].percent = 100;
							map["dispatches"].loading = true;
							map["dispatches"].percent = 10;
							this.syncSource.next(this.lastSyncStatus);
							this.rest.getAllDispatches(lastSyncDate).subscribe(dispatches => {
								map["dispatches"].percent = 50;
								this.syncSource.next(this.lastSyncStatus);
								result.dispatches = dispatches;
								let orders: DispatchOrder[] = [];
								let forms: Form[] = [];
								this.syncSource.next(this.lastSyncStatus);
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
								map["dispatches"].percent = 100;
								this.syncSource.next(this.lastSyncStatus);
								this.db.saveDispatches(orders).subscribe(reply => {
									map["dispatches"].complete = true;
									map["dispatches"].loading = false;
									map["dispatches"].percent = 100;
									this.syncSource.next(this.lastSyncStatus);
									this._isSyncing = false;
									obs.next(result);
									obs.complete();									
									this.syncSource.complete();
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
	forms: Form[] = [];
	dispatches: Dispatch[] = [];
	memberships: DeviceFormMembership[] = [];
}