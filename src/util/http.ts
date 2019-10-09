import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http, XHRBackend, RequestOptions, RequestMethod, Request, RequestOptionsArgs, Response } from '@angular/http';
declare var $: any;

@Injectable()
export class HttpService extends Http {
	public pendingRequests: number = 0;
	public showLoading: boolean = false;

	constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
		super(backend, defaultOptions);
	}

	request(url: Request, options?: RequestOptionsArgs): Observable<Response> {
		let data = url.getBody();
		let threshold = 512;
		return super.request(url, options).map(response => {
			let text = response.text();			
			// console.log(JSON.stringify({
			// 	request: {
			// 		method: this.method(url.method),
			// 		url: url.url.replace(/access\_token\=[\w\d]+/, "access_token=HIDDEN"),
			// 		headers: url.headers.toJSON(),
			// 		data: data.length > threshold ? data.substr(0, threshold) : data
			// 	},
			// 	response: {
			// 		status: response.status,
			// 		headers: response.headers.toJSON(),
			// 		data: text.length > threshold ? text.substr(0, threshold) : response.text
			// 	}				
			// }, null, 2));

			return response;
		});
	}

	private method(m: number): string{
		switch(m){
			case RequestMethod.Get:
				return "GET";
			case RequestMethod.Delete:
				return "DELETE";
			case RequestMethod.Head:
				return "HEAD";
			case RequestMethod.Options:
				return "OPTIONS";
			case RequestMethod.Patch:
				return "PATCH";
			case RequestMethod.Post:
				return "POST";
			case RequestMethod.Put:
				return "PUT";
			
		}
	}
}