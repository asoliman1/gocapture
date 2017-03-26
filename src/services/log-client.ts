import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Observer } from "rxjs/Rx";
import { Util } from "../util/util";

@Injectable()
export class LogClient{

	private logSource: BehaviorSubject<LogEntry>;
    /**
     * Error event
     */
	log: Observable<LogEntry>;

	private logs : LogEntry[] = [];
	
	private consoleHandler: any;

	constructor(){
		this.consoleHandler = window.console;
		var c = "console";
		window[c] = this.makeConsole();

		this.logSource = new BehaviorSubject<LogEntry>(null);
		this.log = this.logSource.asObservable();		
	}

	public getLogs(): LogEntry[]{
		return this.logs;
	}

	private makeConsole() : any{
		return {
			log: Util.proxy(function(message){
								this.logEntry(arguments, LogSeverity.LOG)
							}, this),
			error: Util.proxy(function(message){
								this.logEntry(arguments, LogSeverity.ERROR)
							}, this),
			info: Util.proxy(function(message){
								this.logEntry(arguments, LogSeverity.INFO)
							}, this),
			warn: Util.proxy(function(message){
								this.logEntry(arguments, LogSeverity.WARN)
							}, this)
		}
	}

	private logEntry(messages: any[], severity: LogSeverity){
		this.consoleHandler[severity.name].apply(this.consoleHandler, messages);
		var message = messages[0];
		if(typeof(message) == "object"){
			var cache = [];
			message = JSON.stringify(message, function(key, value) {
				if (typeof value === 'object' && value !== null) {
					if (cache.indexOf(value) !== -1) {
						return "<CIRCULAR_REF>";
					}
					cache.push(value);
				}
				return value;
			}, 2);
			cache = null; 
		}
		this.logs.push(new LogEntry(message, severity));
		this.logSource.next(this.logs[this.logs.length - 1]);
	}
}

export class LogEntry{
	date: Date;
	severity: LogSeverity;
	message: string;

	constructor(message: string, severity: LogSeverity){
		this.message = message;
		this.severity = severity;
		this.date =  new Date();
	}
}

export class LogSeverity{
	public static WARN: LogSeverity = new LogSeverity("warn");
	public static LOG: LogSeverity = new LogSeverity("log");
	public static INFO: LogSeverity = new LogSeverity("info");
	public static ERROR: LogSeverity = new LogSeverity("error");

	public name: string;

	private constructor(name: string){
		this.name = name;
	}
}