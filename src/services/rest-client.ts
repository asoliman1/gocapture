import { Injectable } from "@angular/core";
import { Headers, Response, Http, URLSearchParams, QueryEncoder } from "@angular/http";
import { Config } from "../config";
import { Observable, Observer, BehaviorSubject } from "rxjs/Rx";
import { User, Form, Dispatch, DeviceFormMembership, FormSubmission } from "../model";
import { AuthenticationRequest, DataResponse, RecordsResponse, BaseResponse } from "../model/protocol";
import { Device } from "ionic-native";

@Injectable()
export class RESTClient {

	protected errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	token: string;

	private online = true;

	constructor(private http: Http) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
	}

	public setOnline(val : boolean){
		this.online = val;
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
	public getForms(offset: number = 0, name?: string, updatedAt?: Date, createdAt?: Date): Observable<RecordsResponse<Form>> {
		var opts: any = {
			form_type: "device"
		};
		if (name) {
			opts.name = name;
		}
		if (updatedAt) {
			opts.updated_at = updatedAt.toISOString().split(".")[0] + "+00:00";
		}
		if (createdAt) {
			opts.created_at = updatedAt.toISOString().split(".")[0] + "+00:00";
		}
		if(offset > 0){
			opts.offset = offset;
		}
		return this.call<RecordsResponse<Form>>("GET", "/forms.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.error(resp);
			}
			return resp;
		});
	}

	public getAllForms(lastSyncDate: Date) : Observable<Form[]>{
		let opts: any = {
			form_type: "device"
		};
		if(lastSyncDate){
			opts.updated_at = lastSyncDate.toISOString().split(".")[0] + "+00:00";
		}
		return this.getAll<Form>("/forms.json", opts);
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDispatches(offset: number = 0, lastSync?: Date): Observable<RecordsResponse<Dispatch>> {
		var opts: any = {
		};

		if (lastSync) {
			opts.updated_at = lastSync.toISOString().split(".")[0] + "+00:00";;
		}
		if(offset > 0){
			opts.offset = offset;
		}
		return this.call<RecordsResponse<Dispatch>>("GET", "/dispatches.json", opts)
			.map(resp => {
				if (resp.status != "200") {
					this.errorSource.error(resp);
				}
				return resp;
			});
	}

	public getAllDispatches(lastSyncDate: Date) : Observable<Dispatch[]>{
		let opts: any = {};
		if(lastSyncDate){
			opts.updated_at = lastSyncDate.toISOString().split(".")[0] + "+00:00";;
		}
		return this.getAll<Dispatch>("/dispatches.json", opts)
				.map(resp => {
					resp.forEach((dispatch) => {
						dispatch.orders.forEach((order)=>{
							let form: Form = null;
							dispatch.forms.forEach((f)=>{
								if(f.form_id == order.form_id){
									order.form = f;
								}
							});
							order.form = form;
						});
					});
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
			opts.updated_at = lastSync.toISOString().split(".")[0] + "+00:00";;
		}
		return this.call<RecordsResponse<DeviceFormMembership>>("GET", "/forms/memberships.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.error(resp);
			}
			return resp;
		});
	}

	public getAllDeviceFormMemberships(forms: Form[], lastSync?: Date) : Observable<DeviceFormMembership[]>{
		return new Observable<DeviceFormMembership[]>((obs: Observer<DeviceFormMembership[]>) => {
			var result: DeviceFormMembership[] = [];
			if(!forms || forms.length == 0){
				setTimeout(()=>{
					obs.next(result);
					obs.complete();
				});
				return;
			}
			var index = 0;
			let handler = (data: DeviceFormMembership[])=>{
				data.forEach(item => {
					item.form_id = forms[index].form_id;
				});
				result.push.apply(result, data);
				index++;
				if(index < forms.length){
					doTheCall();
				}else{
					obs.next(result);
					obs.complete();
				}
			};
			let doTheCall = ()=>{
				let params = <any>{
					access_token: this.token,
					form_id: forms[index].form_id
				}
				if(lastSync){
					params.updated_at = lastSync.toISOString().split(".")[0] + "+00:00";
				}
				this.getAll<DeviceFormMembership>("/forms/memberships.json", params).subscribe(handler);
			}
			doTheCall();
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

	public submitForms(data: FormSubmission[]) : Observable<FormSubmission[]> {
		return new Observable<FormSubmission[]>( (obs : Observer<FormSubmission[]>) => {
			var index = 0;
			let result = [];
			if(!data || data.length == 0){
				obs.next(null);
				obs.complete();
				return;
			}
			let handler = (success : boolean) =>{
				if(success == true){
					result.push(data[index]);
				}
				index++;
				if(index >= data.length){
					obs.next(data);
					obs.complete();
					return;
				}
				setTimeout(()=>{
					this.submitForm(data[index]).subscribe(handler, handler);
				}, 150);
			}
			this.submitForm(data[index]).subscribe(handler, handler);
		});
	}

	private getAll<T>(relativeUrl: string, content: any) : Observable<T[]>{
		let response = new Observable<T[]>((obs: Observer<T[]>) => {
			var offset = 0;
			var result: T[] = [];
			let handler = (data: RecordsResponse<T>)=>{
				var records = [];
				if(!data.records){
					
				}else if(Array.isArray(data.records)){
					records = data.records;
				}else{
					records = [data.records];
				}
				result.push.apply(result, records);
				if(data.count + offset < data.total_count){
					offset += data.count;
					doTheCall();
				}else{
					obs.next(result);
					obs.complete();
				}
			};
			let doTheCall = ()=>{
				let params = Object.assign({}, content);
				if(offset > 0){
					params.offset = offset;
				}
				this.call<RecordsResponse<T>>("GET", relativeUrl, params).subscribe(handler);
			}
			doTheCall();
			
		});
		return response;
	}

	private call<T>(method: String, relativeUrl: string, content: any): Observable<T> {
		let response = new Observable<T>((responseObserver: Observer<T>) => {
			var sub: Observable<Response> = null;
			let url = Config.serverUrl + relativeUrl;
			let params = new URLSearchParams();
			params.set("access_token", this.token);
			var opts = {
				headers: this.getHeaders(),
				search: params
			};
			var search = "?access_token=" + encodeURIComponent(this.token);
			for(let field in content){
				search += "&" + encodeURIComponent(field) + "=" + encodeURIComponent(content[field]);
			}
			switch (method) {
				case "GET":
					for(let field in content){
						opts.search.set(field, content[field]);
					}
					delete opts.search;
					sub = this.http.get(url + search, opts);
					break;
				case "POST":
					sub = this.http.post(url, JSON.stringify(content), opts);
					break;
				case "DELETE":					
					for(let field in content){
						opts.search.set(field, content[field]);
					}
					delete opts.search;
					sub = this.http.delete(url + search, opts);
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