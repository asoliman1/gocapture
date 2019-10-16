import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import { Util } from "../util/util";
import { DBClient } from "./db-client";

@Injectable()
export class LogClient {

	private logSource: BehaviorSubject<LogEntry>;
    /**
     * Error event
     */
	log: Observable<LogEntry>;

	private logs: LogEntry[] = [];

	private consoleHandler: any;

	isLoggingEnabled = true;

	constructor(private db: DBClient) {
		this.consoleHandler = window.console;
		var c = "console";
		window[c] = this.makeConsole();

		this.logSource = new BehaviorSubject<LogEntry>(null);
		this.log = this.logSource.asObservable();
	}

	public getLogs(offset: number, limit: number): LogEntry[] {
		return this.logs.slice(offset, offset + limit);
	}

	public clearLogs() {
		this.logs = [];
	}

	public enableLogging(isEnabled) {
		this.isLoggingEnabled = String(isEnabled) == "true";
	}

	private makeConsole(): any {
		return {
			log: Util.proxy(function (message) {
				this.logEntry(arguments, LogSeverity.LOG)
			}, this),
			error: Util.proxy(function (message) {
				this.logEntry(arguments, LogSeverity.ERROR)
			}, this),
			info: Util.proxy(function (message) {
				this.logEntry(arguments, LogSeverity.INFO)
			}, this),
			warn: Util.proxy(function (message) {
				this.logEntry(arguments, LogSeverity.WARN)
			}, this)
		}
	}

	private logEntry(messages: any[], severity: LogSeverity) {
		if (!this.isLoggingEnabled) {
			return;
		}
		this.consoleHandler[severity.name].apply(this.consoleHandler, messages);
		var message = messages[0];
		if (typeof (message) == "object") {
			var cache = [];
			message = JSON.stringify(message, function (key, value) {
				if (value instanceof Date) {
					if (!value.toISOString) {
						return "<DATE>";
					}
					return value;
				}
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
		//add logs at the beginning
		this.logs.unshift(new LogEntry(message, severity));
		this.logSource.next(this.logs[0]);
	}
}

export class LogEntry {
	date: Date;
	severity: LogSeverity;
	message: string;

	constructor(message: string, severity: LogSeverity) {
		this.message = message;
		this.severity = severity;
		this.date = new Date();
	}
}

export class LogSeverity {
	public static WARN: LogSeverity = new LogSeverity("warn");
	public static LOG: LogSeverity = new LogSeverity("log");
	public static INFO: LogSeverity = new LogSeverity("info");
	public static ERROR: LogSeverity = new LogSeverity("error");

	public name: string;

	private constructor(name: string) {
		this.name = name;
	}
}
