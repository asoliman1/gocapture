import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, ClickBlock } from 'ionic-angular';
import { MyApp } from './app.component';
import { Login } from "../views/login";
import { Main } from "../views/main";
import { Dashboard } from "../views/dashboard";
import { Forms } from "../views/forms";
import { Dispatches } from "../views/dispatches";
import { Settings } from "../views/settings";
import { LogView } from "../views/log";
import { FormSummary } from "../views/form-summary";
import { FormReview } from "../views/form-review";
import { FormCapture } from "../views/form-capture";
import { RESTClient} from "../services/rest-client";
import { DBClient } from "../services/db-client";
import { PushClient } from "../services/push-client";
import { SyncClient } from "../services/sync-client";
import { LogClient } from "../services/log-client";
import { BussinessClient } from "../services/business-service";
import { IonPullUpComponent } from '../components/ion-pullup';
import { FormView } from '../components/form-view';
import { BusinessCard, Image, SimpleName, Signature, SignatureModal, Gps, Address, Checkboxes, Radios, Dropdown} from "../components/form-view/elements";
import { ArrayFilterPipe } from '../pipes/filter-pipe';
import { FormControlPipe } from '../pipes/form-control-pipe';
import {ProspectSearch} from "../views/prospect-search";
import { TextMaskModule } from 'angular2-text-mask';
import { SignaturePadModule } from 'angular2-signaturepad';
//import { CustomFormsModule } from 'ng2-validation';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { HttpService } from '../util/http';

@NgModule({
  declarations: [
    MyApp,
    Login,
    Main,
    Dashboard,
    Forms,
    Dispatches,
    Settings,
    IonPullUpComponent,
    FormSummary,
    FormReview,
    FormCapture,
    ArrayFilterPipe,
	FormControlPipe,
	FormView,
	LogView,
	BusinessCard, Image, SimpleName, Signature, SignatureModal, Gps, Address, Checkboxes, Radios, Dropdown,
	ProspectSearch
  ],
  imports: [
    IonicModule.forRoot(MyApp),
	TextMaskModule,
	SignaturePadModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Main,
    Dashboard,
    Forms,
    Dispatches,
    Settings,
    IonPullUpComponent,
    FormSummary,
    FormReview,
    FormCapture,
	FormView,	
	LogView,
	BusinessCard, Image, SimpleName, Signature, SignatureModal, Gps, Address, Checkboxes, Radios, Dropdown,
	ProspectSearch
  ],
  providers: [
    DBClient,
    RESTClient,
    PushClient,
    SyncClient,
	LogClient,
	BussinessClient,
	{ provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class AppModule { }

export function httpFactory(backend: XHRBackend, options: RequestOptions) {
	return new HttpService(backend, options);
}