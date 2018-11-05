import { Component, NgZone } from '@angular/core';
import { LogClient, LogEntry, LogSeverity } from "../../services/log-client";
import { Subscription } from "rxjs/Subscription";
import { Clipboard } from '@ionic-native/clipboard';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import {ThemeProvider} from "../../providers/theme/theme";

@Component({
	selector: 'log',
	templateUrl: 'log.html'
})
export class LogView{

	private sub: Subscription;
  selectedTheme: String;

	logs: LogEntry[];

	//offset and limit for logs for pagination
	offset: number = 0;
	limit: number = 10;
	isMore: boolean = false;

	constructor(private logClient: LogClient,
				private zone: NgZone,
				private viewCtrl: ViewController,
				private clipboard: Clipboard,
        public themeProvider: ThemeProvider) {
    this.themeProvider.getActiveTheme().subscribe(val => this.selectedTheme = val);
	}

	ionViewDidEnter() {
    this.logs = this.logClient.getLogs(this.offset, this.limit);
    this.isMore = this.logs.length == this.limit;
		// this.sub = this.logClient.log.subscribe((logEntry) => {
		//   this.logs.unshift(logEntry);
		// });
	}

	ionViewDidLeave() {
		this.sub.unsubscribe();
		this.sub = null;
	}

	showMore() {
	  this.offset = this.logs.length;
	  let logs = this.logClient.getLogs(this.offset, this.limit);
	  this.isMore = logs.length == this.limit;
	  this.logs = this.logs.concat(logs);
  }

	getColor(log: LogEntry): string{
		if(log.severity == LogSeverity.ERROR){
			return "danger";
		}else if (log.severity == LogSeverity.INFO){
			return "dark";
		} else if(log.severity == LogSeverity.LOG){
			return "dark";
		} else if(log.severity == LogSeverity.WARN){
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

	clearLogs() {
	  this.logClient.clearLogs();
	  this.logs = [];
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
