import { BarcodeResponse, ItemData } from '../model/barcode';
import { Injectable } from "@angular/core";
import { Headers, Response, Http, URLSearchParams } from "@angular/http";
import { Config } from "../config";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { User, Form, Dispatch, DeviceFormMembership, FormSubmission, SubmissionStatus } from "../model";
import { AuthenticationRequest, DataResponse, RecordsResponse, BaseResponse, FormSubmitResponse, SubmissionResponse, FileUploadRequest, FileUploadResponse, FileResponse } from "../model/protocol";
import { Device } from "@ionic-native/device";
import {StatusResponse} from "../model/protocol/status-response";
import {isProductionEnvironment} from "../app/config";

@Injectable()
export class RESTClient {

	protected errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;

	token: string;

	private online = true;
	private device: Device;

	constructor(private http: Http) {
		this.errorSource = new BehaviorSubject<any>(null);
		this.error = this.errorSource.asObservable();
		this.device = new Device();
	}

	public setOnline(val : boolean){
		this.online = val;
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
			form_type: "device"
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
		if(offset > 0){
			opts.offset = offset;
		}
		return this.call<RecordsResponse<Form>>("GET", "/forms.json", opts).map(resp => {
			if (resp.status != "200") {
				this.errorSource.next(resp);
			}
			let result: Form[] = [];
			resp.records.forEach(record => {
				let f = new Form();
				Object.keys(record).forEach(key=>{
					f[key] = record[key];
				});
				f.computeIdentifiers();
				result.push(f);
			});
			resp.records = result;
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
		return this.getAll<Form>("/forms.json", opts).map(resp => {
			let result: Form[] = [];
			resp.forEach(record => {
				let f = new Form();
				Object.keys(record).forEach(key=>{
					f[key] = record[key];
				});
				result.push(f);
				f.computeIdentifiers();
			});
			return result;
		});
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
					this.errorSource.next(resp);
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

	public fetchBarcodeData(barcodeId: string, providerId: string): Observable<ItemData[]>{
		return this.call<BarcodeResponse>("GET", "/barcode/scan.json", {barcode_id: barcodeId, provider_id: providerId})
		.map( resp => {
			return resp.info;
		});
	}

	public getSubmissions(form: Form, lastSyncDate: Date) : Observable<FormSubmission[]>{
		let opts: any = {
			form_id: form.id,
			form_type: "device"
		};
		if(lastSyncDate){
			opts.date_from = lastSyncDate.toISOString().split(".")[0] + "+00:00";;
		}
		let f = form;
		return this.getAll<SubmissionResponse>("/forms/submissions.json", opts)
				.map(resp => {
					let data: FormSubmission[] = [];
					resp.forEach((item: SubmissionResponse) => {
						let entry: FormSubmission = new FormSubmission();
						entry.id = item.activity_id;
						entry.activity_id = item.activity_id;
						entry.status = SubmissionStatus.Submitted;
						entry.prospect_id = parseInt(item.prospect_id+"");
						entry.hold_request_id = item.hold_request_id;
						entry.email = item.email;
						entry.form_id = parseInt(form.id);
						item.data.forEach((dataItem) => {
							if(!dataItem.value){
								return;
							}
							let fieldName = "element_" + dataItem.element_id;
							let field = form.getFieldById(dataItem.element_id);

							switch(field.type){
								case "simple_name":
								case "address":
									let vals = dataItem.value.split(" ");
									if(field.type == "address"){
										if(vals.length > 6){
											let tmp = [];
											vals.forEach((val, index) => {
												if(index <= 6){
													tmp.push(val);
												}else{
													tmp[tmp.length - 1] += " " + val;
												}
											});
											vals = tmp;
										}
									}
									vals.forEach((value, index) => {
										entry.fields[fieldName + "_" + (index+1)] = value;
									});
									break;
								case "image":
								case "business_card":
									try{
										let obj = JSON.parse(dataItem.value);
										if(typeof(obj) == "string" ){
											obj = JSON.parse(obj);
										}
										entry.fields[fieldName] = obj;
										for(var key in <any>entry.fields[fieldName]){
											entry.fields[fieldName][key] = entry.fields[fieldName][key].replace(/\\/g, "");
										}
									}catch(e){
										console.log("Can't parse " + field.type + " for submission " + entry.activity_id)
									}
									break;
								case "checkbox":
									entry.fields[fieldName] = dataItem.value.split(";");
									break;
								default:
									entry.fields[fieldName] = dataItem.value;
							}
						});
						entry.first_name = "";
						entry.last_name = "";
						entry.company = "";
						entry.phone = "";
						entry.updateFields(f);
						data.push(entry);
					});
					return data;
				});
	}

	public getAvailableFormIds(): Observable<number[]>{
		return this.getAll<number>("/device/available_forms.json", {})
		.map(response => {
			let d: number[] = [];
			if(Array.isArray(response)){
				if(response.length > 0){
					if(Number.isInteger(response[0])){
						d = response;
					}else{
						Object.keys(response[0]).forEach(key => {
							d.push(response[0][key]);
						});
					}
				}
			}else{
				Object.keys(response).forEach(key => {
					d.push(response[key]);
				});
			}
			return d;
		});
	}

	public getAllSubmissions(forms: Form[], lastSync?: Date, newFormIds?: number[]) : Observable<FormSubmission[]>{
		return new Observable<FormSubmission[]>((obs: Observer<FormSubmission[]>) => {
			var result: FormSubmission[] = [];
			if(!forms || forms.length == 0){
				setTimeout(()=>{
					obs.next(result);
					obs.complete();
				});
				return;
			}
			var index = 0;
			let syncDate =  newFormIds && newFormIds.length > 0 && newFormIds.indexOf(forms[index].form_id) > -1 ? null : lastSync;
			let handler = (data: FormSubmission[])=>{
				result.push.apply(result, data);
				index++;
				if(index < forms.length){
					syncDate =  newFormIds && newFormIds.length > 0 && newFormIds.indexOf(forms[index].form_id) > -1 ? null : lastSync;
					this.getSubmissions(forms[index], syncDate).subscribe(handler);
				}else{
					obs.next(result);
					obs.complete();
				}
			};
			this.getSubmissions(forms[index], syncDate).subscribe(handler);
		});
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

	public unauthenticate(token: string): Observable<boolean>{
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

	public getAllDeviceFormMemberships(forms: Form[], newFormIds?: number[]) : Observable<DeviceFormMembership[]>{
		return new Observable<DeviceFormMembership[]>((obs: Observer<DeviceFormMembership[]>) => {
			var result: DeviceFormMembership[] = [];
			console.log(forms);
			if(!forms || forms.length == 0){
				console.log("No contacts 1");
				setTimeout(()=>{
					obs.next(result);
					obs.complete();
				});
				return;
			}
			var index = 0;
			let handler = (data: DeviceFormMembership[])=>{
				data.forEach(item => {
				  let form = forms[index];
					item.form_id = form.form_id;
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
					form_id: forms[index].form_id
				};
				let form = forms[index];
				let syncDate = form.members_last_sync_date;
				if(syncDate) {
					params.last_sync_date = syncDate;
				}
				this.getAll<DeviceFormMembership>("/forms/memberships.json", params).subscribe(handler);
			};
			doTheCall();
		});
	}
	/**
	 *
	 * @returns Observable
	 */
	public submitForm(data: FormSubmission): Observable<{id:number,message:string, hold_request_id:number}> {
		return this.call<BaseResponse>("POST", "/forms/submit.json", data)
			.map((resp: FormSubmitResponse) => {
				if (resp.status == "200") {
					return {
						id: resp.activity_id,
						hold_request_id: resp.hold_request_id,
						message: ""
					};
				}
				this.errorSource.next(resp);
				return {
						id: resp.activity_id,
						message: resp.message,
						hold_request_id: null
					};
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
			let handler = (reply: {id : number, message: string}) =>{
				if(reply.id > 0){
					result.push(data[index]);
				}
				index++;
				if(index >= data.length){
					obs.next(result);
					obs.complete();
					return;
				}
				setTimeout(()=>{
					this.submitForm(data[index]).subscribe(handler, handler);
				}, 150);
			};
			this.submitForm(data[index]).subscribe(handler, handler);
		});
	}

	public uploadFiles(req: FileUploadRequest) : Observable<FileResponse[]>{
		return new Observable<FileResponse[]>((obs: Observer<FileResponse[]>) => {
			this.call<FileUploadResponse>("POST", "/drive/upload.json", req)
			.subscribe((data: FileUploadResponse) => {
				if (data.status == "200") {
					obs.next(data.files);
					obs.complete();
				}
				if(data == null){
					obs.error(data.message);
				}
			}, (err) => {
				obs.error(err);
			});
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
			};
			doTheCall();

		});
		return response;
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
          console.log('Response - ' + JSON.stringify(response));
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
