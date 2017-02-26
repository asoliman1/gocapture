import { Component, Inject } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavParams, Nav } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { StatusBar, File } from 'ionic-native';

import { Login } from '../views/login';

import { DBClient } from "../services/db-client";
import { RESTClient } from "../services/rest-client";
import { NavController }  from "ionic-angular";
declare var cordova;

@Component({
	template: '<ion-nav #nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

	rootPage: any;

	@ViewChild(Nav) nav: Nav;

	constructor(public platform: Platform, private db: DBClient, private rest: RESTClient) {
		this.initializeApp();
		this.rootPage = Login;
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.hideSplashScreen();
			StatusBar.hide();
			//ensure folders exist
			File.checkDir(cordova.file.dataDirectory, "leadliaison")
			.then((exists)=>{
				File.checkDir(cordova.file.dataDirectory + "leadliaison/", "images")
				.then((exists)=>{
					console.log("Images folder present");
				}).catch(err=>{
					File.createDir(cordova.file.dataDirectory + "leadliaison/", "images", true)
					.then(ok => {
						console.log("Created images folder");
					}).catch(err => {
						console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
					})
				});
			}).catch(err=>{
				File.createDir(cordova.file.dataDirectory, "leadliaison", true)
				.then(ok => {
					File.createDir(cordova.file.dataDirectory + "leadliaison/", "images", true)
					.then(ok => {
						console.log("Created images folder");
					}).catch(err => {
						console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
					})
				}).catch(err => {
					console.error("Can't create " + cordova.file.dataDirectory + "leadliaison" + ":\n" + JSON.stringify(err, null, 2));
				})
			});
		});
		
		this.rest.error.subscribe((resp)=>{
			if(resp && resp.status == 401){
				this.nav.setRoot(Login, {"unauthorized": true});
			}
		});
	}


	hideSplashScreen() {
		if (navigator && navigator["splashscreen"]) {
			setTimeout(() => {
				navigator["splashscreen"].hide();
			}, 100);
		}
	}
}
