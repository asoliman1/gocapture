import { Injectable } from "@angular/core";
import { Observable, Observer, BehaviorSubject } from "rxjs/Rx";
import { User, Form, Dispatch, DeviceFormMembership, FormSubmission } from "../model";
import { AuthenticationRequest, RecordsResponse } from "../model/protocol";

@Injectable()
export class RESTClientMock {

	private errorSource: BehaviorSubject<any>;
    /**
     * Error event
     */
	error: Observable<any>;
	
	constructor() {
		this["errorSource"] = new BehaviorSubject<any>(null);
		this["error"] = this["errorSource"].asObservable();
	}

	/**
	 * 
	 * @returns Observable
	 */
	public authenticate(req: AuthenticationRequest): Observable<User> {
		return new Observable<User>((responseObserver: Observer<User>) => {
			setTimeout(()=>{
				var user = new User();
				user.access_token = "223412394816239874619287364819725348";
				user.customer_account_name = "customer";
				user.user_profile_picture = "http://a5.mzstatic.com/us/r30/Purple5/v4/5a/2e/e9/5a2ee9b3-8f0e-4f8b-4043-dd3e3ea29766/icon128-2x.png";
				user.customer_logo = "https://3.bp.blogspot.com/-JhISDA9aj1Q/UTECr1GzirI/AAAAAAAAC2o/5qmvWZiCMRQ/s1600/Twitter.png";
				user.user_name = "username";
				user.customer_name = "customer 132";
				user.email = "me@me.com";
				user.first_name = "John";
				user.id = 123;
				user.is_active = 1;
				user.last_name = "Mckenzie";
				user.title = "Mr";
				responseObserver.next(user);
				responseObserver.complete();
			}, 100);
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getForms(name?: string, updatedAt?: Date, createdAt?: Date): Observable<RecordsResponse<Form>> {
		return new Observable<RecordsResponse<Form>>((responseObserver: Observer<RecordsResponse<Form>>) => {
			setTimeout(()=>{
				let response = new RecordsResponse<Form>();
				let forms = <any>[
					{name: "Tradeshow#1", total_submissions: 68},
					{name: "Tradeshow#2", total_submissions: 68},
					{name: "Tradeshow#3", total_submissions: 68},
					{name: "Tradeshow#4", total_submissions: 68},
					{name: "Tradeshow#5", total_submissions: 68},
					{name: "Tradeshow#6", total_submissions: 68},
					{name: "Tradeshow#7", total_submissions: 68},
					{name: "Tradeshow#8", total_submissions: 68},
					{name: "Tradeshow#9", total_submissions: 68},
					{name: "Tradeshow#10", total_submissions: 68},
					{name: "Tradeshow#11", total_submissions: 68},
					{name: "Tradeshow#12", total_submissions: 68},
					{name: "Tradeshow#13", total_submissions: 68},
					{name: "Tradeshow#14", total_submissions: 68},
					{name: "Tradeshow#15", total_submissions: 68},
					{name: "Tradeshow#16", total_submissions: 68},
					{name: "Tradeshow#17", total_submissions: 68}
				]
				response.count = forms.length;
				response.total_count = forms.length;
				response.status = "200";
				response.records = forms;
				responseObserver.next(response);
				responseObserver.complete();
			}, 500);
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDispatches(lastSync?: Date): Observable<RecordsResponse<Dispatch>> {
		return new Observable<RecordsResponse<Dispatch>>((responseObserver: Observer<RecordsResponse<Dispatch>>) => {
			setTimeout(()=>{
				let response = new RecordsResponse<Dispatch>();
				let forms = <any>[
					{name: "Dispatch#1"},
					{name: "Dispatch#2"},
					{name: "Dispatch#3"},
					{name: "Dispatch#4"},
					{name: "Dispatch#5"},
					{name: "Dispatch#6"},
					{name: "Dispatch#7"},
					{name: "Dispatch#8"},
					{name: "Dispatch#9"},
					{name: "Dispatch#10"},
					{name: "Dispatch#11"},
					{name: "Dispatch#12"},
					{name: "Dispatch#13"},
					{name: "Dispatch#14"},
					{name: "Dispatch#15"},
					{name: "Dispatch#16"},
					{name: "Dispatch#17"}
				]
				response.count = forms.length;
				response.total_count = forms.length;
				response.status = "200";
				response.records = forms;
				responseObserver.next(response);
				responseObserver.complete();
			}, 100);
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public registerDeviceToPush(device_token: string, receiveNotifications: boolean = true): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			setTimeout(()=>{
				responseObserver.next(true);
				responseObserver.complete();
			}, 100);
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public getDeviceFormMemberships(form_id: number, lastSync?: Date): Observable<RecordsResponse<DeviceFormMembership>> {
		return new Observable<RecordsResponse<DeviceFormMembership>>((responseObserver: Observer<RecordsResponse<DeviceFormMembership>>) => {
			setTimeout(()=>{
				let response = new RecordsResponse<DeviceFormMembership>();
				let forms = <any>[
					{},
					{},
					{}
				]
				response.count = forms.length;
				response.total_count = forms.length;
				response.status = "200";
				response.records = forms;
				responseObserver.next(response);
				responseObserver.complete();
			}, 100);
		});
	}
	/**
	 * 
	 * @returns Observable
	 */
	public submitForm(data: FormSubmission): Observable<boolean> {
		return new Observable<boolean>((responseObserver: Observer<boolean>) => {
			setTimeout(()=>{
				responseObserver.next(true);
				responseObserver.complete();
			}, 100);
		});
	}
}