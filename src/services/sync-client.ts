import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Observer } from "rxjs/Rx";
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';
import { Transfer, FileEntry, File } from 'ionic-native';
import { SyncStatus, Form, Dispatch, DispatchOrder, DeviceFormMembership, FormSubmission } from "../model";
import { FileUploadRequest, FileInfo } from "../model/protocol";
declare var cordova: any;

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
			this.downloadForms(lastSyncDate, map, result).subscribe((forms) => {
				obs.next(result);
				this.downloadContacts(result.forms, lastSyncDate, map, result).subscribe(() => {
					obs.next(result);
					this.downloadDispatches(lastSyncDate, map, result).subscribe(() => {
						obs.next(result);
						this.downloadSubmissions(result.forms, lastSyncDate, map, result).subscribe(() => {
							obs.next(result);
							obs.complete();
							this._isSyncing = false;
							this.syncSource.complete();
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
			var map: { [key: number]: FormMapEntry } = {};
			this.lastSyncStatus = [];
			forms.forEach(form => {
				map[form.form_id] = {
					form: form,
					urlFields: form.getUrlFields(),
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
					//this.rest.submitForms(map[formIds[index]].submissions).subscribe(handler);
					this.doSubmitAll(map[formIds[index]]).subscribe(handler);
				}, 500);
			};
			this.doSubmitAll(map[formIds[index]]).subscribe(handler);
			//this.rest.submitForms(map[formIds[index]].submissions).subscribe(handler);
		});
	}

	private doSubmitAll(data: FormMapEntry): Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>((obs :Observer<FormSubmission[]>) => {
			let result = [];
			var index = 0;
			let handler = () => {
				if(index == data.submissions.length){
					obs.next(result);
					obs.complete();
					return;
				}
				this.doSubmit(data, index).subscribe((submission) => {
					setTimeout(()=>{
						result.push(submission);
						index++;
						handler();
					});
				}, (err) => {
					index++;
					handler();
				});
			}
			handler();
		});
	}

	private doSubmit(data: FormMapEntry, index: number): Observable<FormSubmission>{
		return new Observable<FormSubmission>((obs :Observer<FormSubmission>) => {
			let submission = data.submissions[index];
			let urlMap: {[key: string]: string} = {};
			let hasUrls = false;
			for(var field in submission.fields){
				if(data.urlFields.indexOf(field) > -1){
					let sub = submission.fields[field];
					if(sub){
						if(sub){
							var val = [];
							if(typeof(sub) == "object"){
								Object.keys(sub).forEach((key)=>{
									val.push(sub[key]);
								});
							}else{
								val = val.concat(sub);
							}
							val.forEach((url) => { 
								if(url){
									urlMap[url] = "";
									hasUrls = true;
								}
							});
						}
					}
				}
			}
			this.uploadImages(urlMap, hasUrls).subscribe((data)=> {
				this.rest.submitForm(submission).subscribe((sub_id)=>{
					submission.activity_id = sub_id;
					this.db.updateSubmissionId(submission).subscribe((ok) => {
						submission.id = submission.activity_id;
						obs.next(submission);
						obs.complete();
					}, err => {
						obs.error(err);
					})
				});
			}, (err) => {
				obs.error(err);
			});

		});
	}

	private uploadImages(urlMap: {[key: string]: string}, hasUrls: boolean): Observable<any>{
		return new Observable<any>((obs : Observer<any>) => {
			if(!hasUrls){
				obs.next(null);
				obs.complete();
				return;
			}
			let index = 0;
			let urls = Object.keys(urlMap);
			let transfer = new Transfer();
			let request = new FileUploadRequest();
			let handler = ()=>{
				if(index >= urls.length){
					this.rest.uploadFiles(request).subscribe((data)=>{
						obs.next(null);
						obs.complete();
					}, err =>{
						obs.error(err);
					})
				}else{
					let folder = urls[index].substr(0, urls[index].lastIndexOf("/"));
					let file = urls[index].substr(urls[index].lastIndexOf("/") + 1);
					File.resolveDirectoryUrl(folder).then(dir =>{
						File.getFile(dir, file, {create:false}).then(fileEntry =>{
							fileEntry.getMetadata((metadata) => {
								//data:[<mediatype>][;base64],<data>
								File.readAsDataURL(folder, file).then((data : string)=>{
									let entry = new FileInfo();
									let d = data.split(";base64,");
									entry.data = d[1];
									entry.name = file;
									entry.size = metadata.size;
									entry.mimeType = d[0].substr(5);
									request.files = [entry];
									index++;
									handler();
								}).catch((err)=>{
									obs.error(err);
								})
							}, err =>{
								obs.error(err);
							});
						}).catch(err => {
							obs.error(err);
						});
					}).catch(err => {
						obs.error(err);
					});
				}
			}
			handler();
		});
	}

	private downloadForms(lastSyncDate: Date, map: { [key: string]: SyncStatus }, result: DownloadData): Observable<Form[]> {
		return new Observable<any>(obs => {
			let mapEntry = map["forms"];
			mapEntry.loading = true;
			mapEntry.percent = 10;
			this.rest.getAllForms(lastSyncDate).subscribe(forms => {
				result.forms = forms;
				forms.forEach((form) => {
					form.id = form.form_id + "";
				})
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveForms(forms).subscribe(reply => {
					mapEntry.complete = true;
					mapEntry.loading = false;
					mapEntry.percent = 100;
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
			let mapEntry = map["contacts"];
			mapEntry.loading = true;
			mapEntry.percent = 10;
			//obs.next(null);
			//obs.complete();
			this.rest.getAllDeviceFormMemberships(forms, lastSyncDate).subscribe((contacts) => {
				result.memberships.push.apply(result.memberships, contacts);
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				this.db.saveMemberships(contacts).subscribe(res => {
					mapEntry.complete = true;
					mapEntry.loading = false;
					mapEntry.percent = 100;
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
			let mapEntry = map["dispatches"];
			mapEntry.loading = true;
			mapEntry.percent = 10;
			this.rest.getAllDispatches(lastSyncDate).subscribe(dispatches => {
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
			let mapEntry = map["submissions"];
			mapEntry.loading = true;
			mapEntry.percent = 10;
			this.rest.getAllSubmissions(forms, lastSyncDate).subscribe(submissions => {
				mapEntry.percent = 50;
				this.syncSource.next(this.lastSyncStatus);
				result.submissions = submissions;
				//let forms: Form[] = [];
				this.downloadImages(forms, submissions).subscribe(subs => {
					this.db.saveSubmisisons(subs).subscribe(reply => {
						mapEntry.complete = true;
						mapEntry.loading = false;
						mapEntry.percent = 100;
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
			}, err => {
				obs.error(err);
			});
		});
	}

	private downloadImages(forms: Form[], submissions: FormSubmission[]): Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>((obs: Observer<FormSubmission[]>) => {
			if(!submissions || submissions.length == 0){
				obs.next([]);
				obs.complete();
				return;
			}
			let map: {[key:string]: Form} = forms.reduce((previous, current, index, array) => { 
				previous[current.id] = current;
				return previous;
			}, {});

			let urlMap: {[key: string]: string} = {};
			let hasUrls = false;
			submissions.forEach((submission) => {
				let urlFields = map[submission.form_id].getUrlFields();
				for(var field in submission.fields){
					if(urlFields.indexOf(field) > -1){
						if(submission.fields[field]){
							var val = [].concat(submission.fields[field]);
							val.forEach((url) => { 
								if(url){
									urlMap[url] = "";
									hasUrls = true;
								}
							});
						}
					}
				}
			});
			if(!hasUrls){
				obs.next(submissions);
				obs.complete();
				return;
			}
			let fileTransfer = new Transfer();
			var urls = Object.keys(urlMap);
			let index = 0;
			let handler = () => {
				if(index == urls.length){
					submissions.forEach(submission => {
						let urlFields = map[submission.form_id].getUrlFields();
						for(var field in submission.fields){
							if(urlFields.indexOf(field) > -1){
								if(submission.fields[field]){
									if(Array.isArray(submission.fields[field])){
										let val = <string[]> submission.fields[field];
										for(let i = 0; i < val.length; i++){
											val[i] = urlMap[val[i]];
										}
									}else{
										submission.fields[field] = urlMap[<string>submission.fields[field]];
									}
								}
							}
						}
					});
					obs.next(submissions);
					obs.complete();
				}else{
					fileTransfer.download(urls[index], cordova.file.dataDirectory + "leadliaison/images/dwn_" + new Date().getTime())
					.then((value : FileEntry) => {
						console.log(value);
						urls[index] = value.fullPath;
						index++;
						setTimeout(()=>{
							handler();
						});
					})
					.catch((err) => {
						console.error(err);
						index++;
						setTimeout(()=>{
							handler();
						});
					});
				}
			}
			handler();
		});
	}

	private isExternalUrl(url: string){
		return url.indexOf("http") == 0;
	}
}


export class DownloadData {
	forms: Form[] = [];
	dispatches: Dispatch[] = [];
	memberships: DeviceFormMembership[] = [];
	submissions: FormSubmission[] = [];
}

class FormMapEntry {
	form: Form;
	urlFields: string[];
	status: SyncStatus;
	submissions: FormSubmission[];
}