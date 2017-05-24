import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
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
		console.log(JSON.stringify({
			method: this.method(url.method),
			url: url.url.replace(/access\_token\=[\w\d]+/, "access_token=HIDDEN"),
			headers: url.headers.toJSON,
			data: url.getBody()
		}, null, 2));
		return super.request(url, options);
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