import { Activation } from './../model/activation';
import { BadgeResponse, Form } from '../model';
import { Injectable } from "@angular/core";
import { Headers, Http, Response, URLSearchParams } from "@angular/http";
import { Config } from "../config";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { DeviceFormMembership, FormSubmission } from "../model";
import {
	BaseResponse,
	FileResponse,
	FileUploadRequest,
	FileUploadResponse,
	FormSubmitResponse,
	RecordsResponse,
	FileDownloadResponse
} from "../model/protocol";
import { StatusResponse } from "../model/protocol/status-response";
import { retry } from "rxjs/operators/retry";
import { ActivationSubmission } from '../model/activation-submission';

@Injectable()
export class RESTClient {

	protected errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	private token: string = localStorage['token'];

	private online = true;

	constructor(private http: Http) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
	}

	public setOnline(val: boolean) {
		this.online = val;
	}

	public setToken(token: string) {
		localStorage.setItem('token',token);
		this.token = token;
	}

	public getFormById(id: string | number) {
		return this.call("GET", "/forms.json", { form_id: id,form_type: "device",mode: "device_sync" }).map((e : any) => Form.parse(e.records[0]))
	}

	public getActivationById(id: string | number) {
		return this.call("GET", "/activations.json", { activation_id: id , activation_name:"before whack it" }).map((e:any)=> Activation.parseActivation(e.records[0],e.records[0].event.form_id))
	}

	public fetchBadgeData(barcodeId: string, providerId: string, isRapidScan: number = 0, formId?: string, ): Observable<any> {
		return this.call<BadgeResponse>("GET", "/barcode/scan.json",
			{ barcode_id: barcodeId, provider_id: providerId, is_rapid_scan: isRapidScan, form_id: formId })
			.map(resp => {
				return resp;
			});
	}

	public getDocumentInfo(documentId: number): Observable<RecordsResponse<FileDownloadResponse>> {
		return this.call<RecordsResponse<FileDownloadResponse>>('GET', '/files.json', { id: documentId })
			.map((res) => res);
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
					//console.log("search url", url + search, opts)
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
