import { Injectable } from "@angular/core";
import { Headers, Response, Http } from "@angular/http";
import { Config } from "../config";
import { Observable, Observer, BehaviorSubject } from "rxjs/Rx";
import { User, Form, Dispatch, DeviceFormMembership, FormSubmission } from "../model";
import { AuthenticationRequest, DataResponse, RecordsResponse, BaseResponse } from "../model/protocol";
import { Device } from "ionic-native";

@Injectable()
export class RESTClientGood {

	protected errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	private token: string;

	constructor(private http: Http) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
	}

	/**
	 * 
	 * @returns Observable
	 */
	public authenticate(req: AuthenticationRequest): Observable<User> {
		req.device_platform = <any>Device.device.platform;
		req.device_model = Device.device.model;
		req.device_manufacture = Device.device.manufacturer;
		req.device_os_version = Device.device.version;
		req.device_uuid = Device.device.uuid;
		return this.call<DataResponse<User>>("POST", "/authenticate.json", req)
		.map(resp => {
			if (resp.status != "200") {
				this.errorSource.error(resp);
			}
			this.token = resp.data.access_token;
			return resp.data;
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getForms(name?: string, updatedAt?: Date, createdAt?: Date): Observable<RecordsResponse<Form>> {
		var opts: any = {
			access_token: this.token,
			form_type: "device"
		};
		if (name) {
			opts.name = name;
		}
		if (updatedAt) {
			opts.updated_at = updatedAt.toISOString();
		}
		if (createdAt) {
			opts.created_at = updatedAt.toISOString();
		}
		return this.call<RecordsResponse<Form>>("GET", "/forms.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.error(resp);
			}
			return resp;
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDispatches(lastSync?: Date): Observable<RecordsResponse<Dispatch>> {
		var opts: any = {
			access_token: this.token
		};

		if (lastSync) {
			opts.last_sync_date = lastSync.toISOString();
		}
		return this.call<RecordsResponse<Dispatch>>("GET", "/dispatches.json", opts)
			.map(resp => {
				if (resp.status != "200") {
					this.errorSource.error(resp);
				}
				return resp;
			});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public registerDeviceToPush(device_token: string, receiveNotifications: boolean = true): Observable<boolean> {
		return this.call<BaseResponse>("POST", '/devices/register_to_notifications.json?access_token=' + this.token, {
			device_token: device_token,
			is_allow_to_receive_notification: receiveNotifications
		})
			.map((resp: BaseResponse) => {
				if (resp.status == "200") {
					return true;
				}
				this.errorSource.error(resp);
				return false;
			});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDeviceFormMemberships(form_id: number, lastSync?: Date): Observable<RecordsResponse<DeviceFormMembership>> {
		var opts: any = {
			access_token: this.token,
			form_id: form_id
		};
		if (lastSync) {
			opts.last_sync_date = lastSync.toISOString();
		}
		return this.call<RecordsResponse<DeviceFormMembership>>("GET", "/forms/memberships.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.error(resp);
			}
			return resp;
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public submitForm(data: FormSubmission): Observable<boolean> {
		return this.call<BaseResponse>("POST", "/forms/submit.json?access_token=" + this.token, data)
			.map((resp: BaseResponse) => {
				if (resp.status == "200") {
					return true;
				}
				this.errorSource.error(resp);
				return false;
			});
	}

	private call<T>(method: String, relativeUrl: string, content: any): Observable<T> {
		let response = new Observable<T>((responseObserver: Observer<T>) => {
			var sub: Observable<Response> = null;
			let url = Config.serverUrl + relativeUrl;
			var opts = {
				headers: this.getHeaders()
			};
			switch (method) {
				case "GET":
					opts = Object.assign(opts, content);
					sub = this.http.get(url, opts);
					break;
				case "POST":
					sub = this.http.post(url, JSON.stringify(content), opts);
					break;
				case "DELETE":
					opts = Object.assign(opts, content);
					sub = this.http.delete(url, opts);
					break;
				case "PATCH":
					sub = this.http.patch(url, content, opts);
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
					responseObserver.next(response as T);
					responseObserver.complete();
				},
				(err) => {
					this.errorSource.next(err);
					responseObserver.error(err);
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