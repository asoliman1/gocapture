import { Component, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { LogClient, LogEntry, LogSeverity } from "../../services/log-client";
import { Subscription } from "rxjs";
import { Clipboard } from '@ionic-native/clipboard';

@Component({
	selector: 'log',
	templateUrl: 'log.html'
})
export class LogView{
	
	private sub: Subscription;

	logs: LogEntry[];

	constructor(private logClient: LogClient, 
				private zone: NgZone, 
				private viewCtrl: ViewController,
				private clipboard: Clipboard) {

	}

	ionViewDidEnter() {
		this.sub = this.logClient.log.subscribe((logEntry) => {
			this.logs = this.logClient.getLogs();
		});
	}

	ionViewDidLeave() {
		this.sub.unsubscribe();
		this.sub = null;
	}

	getColor(log: LogEntry): string{
		if(log.severity == LogSeverity.ERROR){
			return "danger";
		}else if(log.severity == LogSeverity.INFO){
			return "primary";
		}else if(log.severity == LogSeverity.LOG){
			return "primary";
		}else if(log.severity == LogSeverity.WARN){
			return "orange";
		}
		return "";
	}

	getIcon(log: LogEntry): string{
		if(log.severity == LogSeverity.ERROR){
			return "bug";
		}else if(log.severity == LogSeverity.INFO){
			return "information-circle";
		}else if(log.severity == LogSeverity.LOG){
			return "information-circle";
		}else if(log.severity == LogSeverity.WARN){
			return "warning";
		}
		return "";
	}

	cancel() {
		this.viewCtrl.dismiss(null);
	}

	done() {
		this.viewCtrl.dismiss(null);
	}

	copy(){
		let result = "";
		this.logs.forEach((log)=>{
			result += "[" + log.severity.name + "] - " + log.message + "\n\n";
		});
		this.clipboard.copy(result)
			.then((data) => {

			})
			.catch((err)=>{
				console.error(err);
			});
	}
}