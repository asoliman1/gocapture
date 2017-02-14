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

	private entitySyncedSource: BehaviorSubject<string>;
    /**
     * Sync update event
     */
	entitySynced: Observable<string>;

	private _isSyncing: boolean = false;

	private lastSyncStatus: SyncStatus[];

	constructor(private rest: RESTClient, private db: DBClient) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		this.syncSource = new BehaviorSubject<SyncStatus[]>(null);
		this.onSync = this.syncSource.asObservable();
		this.entitySyncedSource = new BehaviorSubject<string>(null);
		this.entitySynced = this.entitySyncedSource.asObservable();

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
			var map: { [key: string]: SyncStatus } = {
				forms: new SyncStatus(true, false, 0, "Forms", 10),
				contacts: new SyncStatus(false, false, 0, "Contacts", 0),
				dispatches: new SyncStatus(false, false, 0, "Dispatches", 0),
				submissions: new SyncStatus(false, false, 0, "Submissions", 0)
			}
			this._isSyncing = true;
			this.lastSyncStatus = [
				map["forms"],
				map["contacts"],
				map["dispatches"],
				map["submissions"]
			];
			this.syncSource.next(this.lastSyncStatus);
			this.downloadForms(lastSyncDate, map, result).subscribe((forms)=>{
				obs.next(result);
				this.downloadContacts(forms, lastSyncDate, map, result).subscribe(() => {
					obs.next(result);
					this.downloadDispatches(lastSyncDate, map, result).subscribe(() => {
						obs.next(result);
						this.downloadSubmissions(forms, lastSyncDate, map, result).subscribe(() => {
							obs.next(result);
							obs.complete();
							//this._isSyncing = false;
							//this.syncSource.complete();
						}, (err) => {
							obs.error(err);
						});
					}, (err) => {
						obs.error(err);
					});
				}, (err) => {
					obs.error(err);
				});
			}, (err) => {
				obs.error(err);
			});
		});
	}

	public sync(submissions: FormSubmission[], forms: Form[]): Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>(obs => {
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
			let handler = (submitted: FormSubmission[]) => {
				result.push.apply(result, submitted);
				map[formIds[index]].status.complete = true;
				map[formIds[index]].status.loading = false;
				this.syncSource.next(this.lastSyncStatus);
				index++;
				if (index >= formIds.length) {
					this._isSyncing = false;
					obs.next(result);
					obs.complete();
					//this.syncSource.complete();
					return;
				}
				setTimeout(() => {
					this.rest.submitForms(map[formIds[index]].submissions).subscribe(handler);
				}, 500);
			};
			this.rest.submitForms(map[formIds[index]].submissions).subscribe(handler);
		});
	}

	private downloadForms(lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData) : Observable<Form[]> {
		return new Observable<any>(obs => {
			this.rest.getAllForms(lastSyncDate).subscribe(forms => {
				result.forms = forms;
				forms.forEach((form) => {
					form.id = form.form_id + "";
				})
				let mapEntry = map["forms"];
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveForms(forms).subscribe(reply => {
					mapEntry.complete = true;
					mapEntry.loading = false;
					mapEntry.percent = 100;
					mapEntry.loading = true;
					mapEntry.percent = 10;
					this.entitySyncedSource.next(mapEntry.formName);
					this.syncSource.next(this.lastSyncStatus);
					obs.next(forms);
					obs.complete();					
				}, err => {
					obs.error(err);
				});
			}, err => {
				obs.error(err);
			});
		});
	}

	private downloadContacts(forms: Form[], lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
		return new Observable<any>(obs => {
			this.rest.getAllDeviceFormMemberships(forms, lastSyncDate).subscribe((contacts) => {
				result.memberships.push.apply(result.memberships, contacts);
				let mapEntry = map["contacts"];
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveMemberships(contacts).subscribe(res => {
					mapEntry.complete = true;
					mapEntry.loading = false;
					mapEntry.percent = 100;
					mapEntry.loading = true;
					mapEntry.percent = 10;
					this.entitySyncedSource.next(mapEntry.formName);
					this.syncSource.next(this.lastSyncStatus);
					obs.next(null);
					obs.complete();
				}, err => {
					obs.error(err);
				});
			}, err => {
				obs.error(err);
			});
		});
	}

	private downloadDispatches(lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
		return new Observable<any>(obs => {
			this.rest.getAllDispatches(lastSyncDate).subscribe(dispatches => {
				let mapEntry = map["dispatches"]; 
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				result.dispatches = dispatches;
				let orders: DispatchOrder[] = [];
				let forms: Form[] = [];
				this.syncSource.next(this.lastSyncStatus);
				dispatches.forEach(dispatch => {
					orders.push.apply(orders, dispatch.orders);
					dispatch.forms.forEach(f => {
						if (forms.filter((form) => { return form.form_id == f.form_id }).length == 0) {
							forms.push(f);
						}
					});
				});
				orders.forEach(order => {
					order.form = forms.filter(f => { return f.form_id == order.form_id })[0];
					order.id = order.id + "" + order.form_id;
				});
				mapEntry.percent = 100;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveDispatches(orders).subscribe(reply => {
					mapEntry.complete = true;
					mapEntry.loading = false;
					mapEntry.percent = 100;
					this.entitySyncedSource.next(mapEntry.formName);
					this.syncSource.next(this.lastSyncStatus);
					obs.next(null);
					obs.complete();
				});
			}, err => {
				obs.error(err);
			});
		});
	}

	private downloadSubmissions(forms: Form[], lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<any> {
		return new Observable<any>(obs => {
			this.rest.getAllSubmissions(forms, lastSyncDate).subscribe(submissions => {
				let mapEntry = map["submissions"]; 
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				result.submissions = submissions;
				let forms: Form[] = [];
				this.syncSource.next(this.lastSyncStatus);
				mapEntry.percent = 100;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveSubmisisons(submissions).subscribe(reply => {
					mapEntry.complete = true;
					mapEntry.loading = false;
					mapEntry.percent = 100;
					this.entitySyncedSource.next(mapEntry.formName);
					this.syncSource.next(this.lastSyncStatus);
					obs.next(null);
					obs.complete();
				});
			}, err => {
				obs.error(err);
			});
		});
	}
}

export class DownloadData {
	forms: Form[] = [];
	dispatches: Dispatch[] = [];
	memberships: DeviceFormMembership[] = [];
	submissions: FormSubmission[] = [];
}