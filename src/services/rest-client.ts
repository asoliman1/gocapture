import { BadgeResponse } from '../model';
import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import { Config } from "../config";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DeviceFormMembership, Form, FormSubmission, User } from "../model";
import {
  AuthenticationRequest,
  BaseResponse,
  DataResponse,
  FileResponse,
  FileUploadRequest,
  FileUploadResponse,
  FormSubmitResponse,
  RecordsResponse,
  SubmissionResponse,
  FileDownloadResponse
} from "../model/protocol";
import { Device } from "@ionic-native/device";
import { StatusResponse } from "../model/protocol/status-response";
import { isProductionEnvironment } from "../app/config";
import { retry } from "rxjs/operators/retry";
import { SubmissionsRepository } from "./submissions-repository";
import { SubmissionMapper } from "./submission-mapper";
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from 'ionic-angular/platform/platform';
import { Activation } from '../model/activation';
import { ActivationSubmission } from '../model/activation-submission';

@Injectable()
export class RESTClient {

	protected errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	token: string;

	private online = true;
	public device: Device;
	private bundleId: string;

	constructor(private http: Http,
		private submissionsRepository: SubmissionsRepository,
		private submissionMapper: SubmissionMapper,
		private appVersion: AppVersion,
		private platform: Platform
		) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		this.device = new Device();
		this.setPackageName();
	}

	public setOnline(val: boolean) {
		this.online = val;
	}


	private setPackageName() {
		this.platform.ready().then((readySource)=>{
		  this.appVersion.getPackageName().then((packageName) => {
			this.bundleId = packageName;
			console.log('bundleId - ' + this.bundleId);
		  }, (error) => {
			console.error(error);
		  })
		})
	  }
	/**
	 *
	 * @returns Observable
	 */
	public authenticate(req: AuthenticationRequest): Observable<User> {
		req.device_platform = <any>this.device.platform;
		req.device_model = this.device.model;
		req.device_manufacture = this.device.manufacturer;
		req.device_os_version = this.device.version;
		req.device_uuid = this.device.uuid;
		req.bundle_id = this.bundleId;
		return this.call<DataResponse<User>>("POST", "/authenticate.json", req)
			.map(resp => {
				if (resp.status != "200") {
					this.errorSource.next(resp);
				}
				this.token = resp.data.access_token;
				return resp.data;
			});
	}
	/**
	 *
	 * @returns Observable
	 */
	public getForms(offset: number = 0, name?: string, updatedAt?: Date, createdAt?: Date): Observable<RecordsResponse<Form>> {
		var opts: any = {
			form_type: "device",
			mode: "device_sync"
		};
		if (name) {
			opts.name = name;
		}
		if (updatedAt) {
			opts.updated_at = updatedAt.toISOString().split(".")[0] + "+00:00";
		}
		if (createdAt) {
			opts.created_at = createdAt.toISOString().split(".")[0] + "+00:00";
		}
		if (offset > 0) {
			opts.offset = offset;
		}

		return this.call<RecordsResponse<Form>>("GET", "/forms.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.next(resp);
			}
			let result: Form[] = [];
			resp.records.forEach(record => {
				let f = new Form();
				Object.keys(record).forEach(key => {
					f[key] = record[key];
				});
				f.computeIdentifiers();
				result.push(f);
			});
			resp.records = result;
			return resp;
		});
	}

	public getAllActivations(forms : Form[],params : any){
		return new Observable<{activations :Activation[],form: Form}>((obs: Observer<{activations :Activation[],form: Form}>) => {
			var result: {activations :Activation[],form: Form} = {activations:[],form:null};
			if (!forms || forms.length == 0) {
				setTimeout(() => {
					obs.next(result);
					obs.complete();
				});
				return;
			}
			var index = 0;
			let handler = (data: Activation[]) => {
				result.activations = data;
				result.form = forms[index];
				obs.next({...result})
				index++;
				if (index < forms.length) {
					this.getFormActivations(forms[index] , params ).subscribe(handler);
				} else {
					obs.complete();
				}
			};
			this.getFormActivations(forms[index],params).subscribe(handler,(err)=>obs.error(err));
		});
	}

	public getFormActivations(form : Form,params : any,lastSyncDate ? : Date ): Observable<Activation[]> {
		let opts: any = {
			form_id: form.form_id,
			include_inactive : 0,
			...params
		};
		return this.getAll<{records:Activation[]}>("/activations.json", opts).map(resp => {
			return Activation.parseActivations(resp,form);
		});
	}

	public getAllForms(lastSyncDate: Date): Observable<{forms:Form[],availableForms:number[]}> {
		let opts: any = {
			form_type: "device",
			mode: "device_sync",
		};
		if (lastSyncDate) {
			opts.updated_at = lastSyncDate.toISOString().split(".")[0] + "+00:00";
		}
		return this.getAll<{records:Form[],available_forms:number[]}>("/forms.json", opts).map(resp => {
			let result: {forms:Form[],availableForms:number[]} = {forms:[],availableForms:resp[0].available_forms};
			resp.forEach(record => {
				record.records.forEach(form=>{
					let f = new Form();
					Object.keys(form).forEach(key => {
						f[key] = form[key];
					});
					result.forms.push(f);
					f.computeIdentifiers();
				})
			});
			return result;
		});
	}

	public fetchBadgeData(barcodeId: string, providerId: string, isRapidScan: number = 0, formId?: string, ): Observable<any> {
		return this.call<BadgeResponse>("GET", "/barcode/scan.json",
			{ barcode_id: barcodeId, provider_id: providerId, is_rapid_scan: isRapidScan, form_id: formId })
			.map(resp => {
				return resp;
			});
	}

	public getSubmissions(form: Form, lastSyncDate: Date): Observable<FormSubmission[]> {
		let opts: any = {
			form_id: form.id,
			form_type: "device"
		};
		if (lastSyncDate) {
			opts.date_from = lastSyncDate.toISOString().split(".")[0] + "+00:00";
		}
		return this.getAllItems<SubmissionResponse>("/forms/submissions.json", opts)
			.map(resp => {
				if (resp.deletedItems) {
					this.submissionsRepository.handleDeletedSubmissions(resp.deletedItems).subscribe(() => {
						console.log('Removed deleted submissions - DONE');
					});
				}

				if (resp.deletedHoldItems) {
					this.submissionsRepository.handleDeletedHoldSubmissions(resp.deletedHoldItems).subscribe(() => {
						console.log('Removed deleted HOLD submissions - DONE');
					});
				}
				return this.handleSubmissionsResponse(form, resp.items);
			});
	}

	private handleSubmissionsResponse(form, items) {
		let data: FormSubmission[] = [];
		items.forEach((item: SubmissionResponse) => {
			let formSubmmission = this.submissionMapper.map(form, item);

			data.push(formSubmmission);
		});
		return data;
	}


	public getAllSubmissions(forms: Form[]): Observable<{submissions :FormSubmission[],form: Form}> {
		return new Observable<{submissions :FormSubmission[],form: Form}>((obs: Observer<{submissions :FormSubmission[],form: Form}>) => {
			var result: {submissions :FormSubmission[],form: Form} = {submissions:[],form:null};
			if (!forms || forms.length == 0) {
				setTimeout(() => {
					obs.next(result);
					obs.complete();
				});
				return;
			}
			var index = 0;
			let syncDate = forms[index].lastSync && forms[index].lastSync.submissions ? 
			new Date(forms[index].lastSync.submissions) : null;
			let handler = (data: FormSubmission[]) => {
				result.submissions = data;
				result.form = forms[index];
				obs.next(result)
				index++;
				if (index < forms.length) {
					 syncDate = forms[index].lastSync && forms[index].lastSync.submissions ? 
								   new Date(forms[index].lastSync.submissions) : null;
					this.getSubmissions(forms[index], syncDate).subscribe(handler);
				} else {
					obs.complete();
				}
			};
			this.getSubmissions(forms[index], syncDate).subscribe(handler);
		});
	}


	public getDocumentInfo(documentId: number): Observable<RecordsResponse<FileDownloadResponse>> {
		return this.call<RecordsResponse<FileDownloadResponse>>('GET', '/files.json', { id: documentId })
			.map((res) => res);
	}

	/**
	 *
	 * @returns Observable
	 */
	public registerDeviceToPush(device_token: string, receiveNotifications: boolean = true): Observable<boolean> {
		return this.call<BaseResponse>("POST", '/devices/register_to_notifications.json', {
			device_token: device_token,
			is_allow_to_receive_notification: receiveNotifications,
			is_dev: !isProductionEnvironment
		})
			.map((resp: BaseResponse) => {
				if (resp.status == "200") {
					return true;
				}
				this.errorSource.next(resp);
				return false;
			});
	}

	public unauthenticate(token: string): Observable<boolean> {
		return this.call<BaseResponse>("POST", '/devices/unauthorize.json', JSON.stringify(""))
			.map((resp: BaseResponse) => {
				if (resp.status == "200") {
					return true;
				}
				this.errorSource.next(resp);
				return false;
			});
	}

	public validateAccessToken(access_token: string): Observable<StatusResponse<string>> {
		return this.call<StatusResponse<string>>("POST", '/validate_access_token.json', {
			access_token: access_token,
		})
			.map(resp => {
				if (resp.status != "200") {
					this.errorSource.next(resp);
				}
				return resp;
			});
	}
	/**
	 *
	 * @returns Observable
	 */
	public getDeviceFormMemberships(form_id: number, lastSync?: Date): Observable<RecordsResponse<DeviceFormMembership>> {
		var opts: any = {
			form_id: form_id
		};
		if (lastSync) {
			opts.last_sync_date = lastSync.toISOString().split(".")[0] + "+00:00";
		}
		return this.call<RecordsResponse<DeviceFormMembership>>("GET", "/forms/memberships.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.next(resp);
			}
			return resp;
		});
	}

	public getAllDeviceFormMemberships(forms: Form[]): Observable<{contacts:DeviceFormMembership[],form:Form,all:boolean}> {
		return new Observable<{contacts:DeviceFormMembership[],form:Form,all:boolean}>((obs: Observer<{contacts:DeviceFormMembership[],form:Form,all:boolean}>) => {
			var result: { contacts:DeviceFormMembership[] , form:Form ,all:boolean} = {contacts:[],form:new Form(),all:false} ;
			if (!forms || forms.length == 0) {
				setTimeout(() => {
					obs.next(result);
					obs.complete();
				});
				return;
			}
			var index = 0;
			let handler = (data: DeviceFormMembership[]) => {
				data.forEach(item => {
					let form = forms[index];
					item.form_id = form.form_id;
				});
				result.contacts = data;
				result.form = forms[index];
				result.all = false;
				obs.next(result);
			};
			let handlerCmp = () =>{
				result.contacts = [];
				result.form = forms[index];
				result.all = true;
				obs.next(result);
				index++;
			   if (index < forms.length) {
				   doTheCall();
			   }else {
				   obs.complete();
			   }
			}
			let doTheCall = () => {
				let params = <any>{
					form_id: forms[index].form_id
				};
				let syncDate = forms[index].lastSync && forms[index].lastSync.contacts ?
				 new Date(forms[index].lastSync.contacts) : null;
				if (syncDate) {
					params.last_sync_date = syncDate.toISOString().split(".")[0] + "+00:00";
				}
				this.getAll<DeviceFormMembership>("/forms/memberships.json", params).subscribe(handler,(err)=>obs.error(err),handlerCmp);
			};
			doTheCall();
		});
	}

	public submitActivation(data: ActivationSubmission): Observable<boolean> {
		return this.call<BaseResponse>("POST", "/activations/submit.json", data)
			.map((resp: FormSubmitResponse) => {
				if (resp.status == "200") {
					return true;
				}
				this.errorSource.next(resp);
				return false;
			});
	}
	/**
	 *
	 * @returns Observable
	 */
	public submitForm(data: FormSubmission): Observable<{
		id: number,
		message: string,
		hold_request_id: number,
		response_status: string,
		form_id: number;
		duplicate_action?: string,
		submission?: FormSubmission,
		is_new_submission: boolean
	}> {
		return this.call<BaseResponse>("POST", "/forms/submit.json", data)
			.map((resp: FormSubmitResponse) => {
				if (resp.status == "200") {
					return {
						id: resp.activity_id,
						hold_request_id: resp.hold_request_id,
						message: "",
						response_status: resp.status,
						form_id: data.form_id,
						is_new_submission: resp.is_new_submission,
						submission: resp.submission,
					};
				}
				this.errorSource.next(resp);
				return {
					id: resp.activity_id,
					message: resp.message,
					hold_request_id: null,
					response_status: resp.status,
					duplicate_action: resp.duplicate_action,
					submission: resp.submission,
					form_id: data.form_id,
					is_new_submission: resp.is_new_submission
				};
			});
	}

	public submitForms(data: FormSubmission[]): Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>((obs: Observer<FormSubmission[]>) => {
			var index = 0;
			let result = [];
			if (!data || data.length == 0) {
				obs.next(null);
				obs.complete();
				return;
			}
			let handler = (reply: { id: number, message: string }) => {
				if (reply.id > 0) {
					result.push(data[index]);
				}
				index++;
				if (index >= data.length) {
					obs.next(result);
					obs.complete();
					return;
				}
				setTimeout(() => {
					this.submitForm(data[index]).subscribe(handler, handler);
				}, 150);
			};
			this.submitForm(data[index]).subscribe(handler, handler);
		});
	}

	public uploadFiles(req: FileUploadRequest): Observable<FileResponse[]> {
		return new Observable<FileResponse[]>((obs: Observer<FileResponse[]>) => {
			this.call<FileUploadResponse>("POST", "/drive/upload.json", req)
				.subscribe((data: FileUploadResponse) => {
					if (data.status == "200") {
						obs.next(data.files);
						obs.complete();
					}
					if (data == null) {
						obs.error(data.message);
					}
				}, (err) => {
					obs.error(err);
				});
		});
	}

	private getAll<T>(relativeUrl: string, content: any): Observable<T[]> {
		let response = new Observable<T[]>((obs: Observer<T[]>) => {
			var offset = 0;
			var result: T[] = [];
			let handler = (data: RecordsResponse<T>) => {
				var records = [];
				if (!data.records) {

				} else if (Array.isArray(data.records)) {
					if(data.available_forms)
					records = [{available_forms : data.available_forms,records : data.records}]
					else
					records = data.records;
				} else {
					records = [data.records];
				}

				result.push.apply(result, records);
				obs.next(records);
				if (data.count + offset < data.total_count) {
					offset += data.count;
					doTheCall();
				} else {
					obs.complete();
				}
			};
			let doTheCall = () => {
				let params = Object.assign({}, content);
				if (offset > 0) {
					params.offset = offset;
				}
				this.call<RecordsResponse<T>>("GET", relativeUrl, params).subscribe(handler,(err)=>obs.error(err));
			};
			doTheCall();

		});
		return response;
	}

	private getAllItems<T>(relativeUrl: string, content: any): Observable<{ items: T[], deletedItems: any[], deletedHoldItems: any[] }> {
		return new Observable<{ items: T[], deletedItems: any[], deletedHoldItems: any[] }>((obs: Observer<{ items: T[], deletedItems: any[], deletedHoldItems: any[] }>) => {
			let offset = 0;
			let result: { items: T[], deletedItems: any[], deletedHoldItems: any[] } = { items: [], deletedItems: [], deletedHoldItems: [] };
			let handler = (data: RecordsResponse<T>) => {

				let records = [];
				let deletedRecords = [];
				let deletedHoldRecords = [];

				if (data["deleted_submissions"]) {
					deletedRecords = data["deleted_submissions"].map((item) => {
						return item.activity_id;
					});
				}

				if (data["deleted_hold_submissions"]) {
					deletedHoldRecords = data["deleted_hold_submissions"].map((item) => {
						return item.hold_id;
					});
				}

				if (!data.records) {

				} else if (Array.isArray(data.records)) {
					records = data.records;
				} else {
					records = [data.records];
				}

				result.items.push.apply(result.items, records);
				result.deletedItems.push.apply(result.deletedItems, deletedRecords);
				result.deletedHoldItems.push.apply(result.deletedHoldItems, deletedHoldRecords);

				if (data.count + offset < data.total_count) {
					offset += data.count;
					doTheCall();
				} else {
					obs.next(result);
					obs.complete();
				}
			};

			let doTheCall = () => {
				let params = Object.assign({}, content);
				if (offset > 0) {
					params.offset = offset;
				}
				this.call<RecordsResponse<T>>("GET", relativeUrl, params).subscribe(handler);
			};
			doTheCall();

		});
	}

	private call<T>(method: String, relativeUrl: string, content: any): Observable<T> {
		let response = new Observable<T>((responseObserver: Observer<T>) => {
			var sub: Observable<Response> = null;
			let url = Config.getServerUrl() + relativeUrl;
			let params = new URLSearchParams();
			params.set("access_token", this.token);
			var opts = {
				headers: this.getHeaders(),
				search: params
			};
			var search = "?access_token=" + encodeURIComponent(this.token);
			for (let field in content) {
				search += "&" + encodeURIComponent(field) + "=" + encodeURIComponent(content[field]);
			}
			switch (method) {
				case "GET":
					for (let field in content) {
						opts.search.set(field, content[field]);
					}
					delete opts.search;
					sub = this.http.get(url + search, opts).pipe(
						retry(3)
					);
					break;
				case "POST":
					sub = this.http.post(url, JSON.stringify(content), opts).pipe(
						retry(3)
					);
					break;
				case "DELETE":
					for (let field in content) {
						opts.search.set(field, content[field]);
					}
					delete opts.search;
					sub = this.http.delete(url + search, opts).pipe(
						retry(3)
					);
					break;
				case "PATCH":
					sub = this.http.patch(url, content, opts).pipe(
						retry(3)
					);
					break;
			}

			sub
				.map((response: any) => {
					if (response._body) {
						try {
							return response.json();
						} catch (e) { }
					}
					return null;
				})
				.subscribe(
					response => {
						// console.log('Response - ' + JSON.stringify(response));
						responseObserver.next(response as T);
						responseObserver.complete();
					},
					(err) => {
						console.error('ERROR - ' + JSON.stringify(err));
						let error = err.json();
						this.errorSource.next(error);
						responseObserver.error(error);
					}
				);
		});
		return response;
	}

	private getHeaders() {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return headers;
	}
}
