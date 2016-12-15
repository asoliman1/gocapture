import { NgModule } from '@angular/core';
import { IonicApp, IonicModule, ClickBlock } from 'ionic-angular';
import { MyApp } from './app.component';
import { Login } from "../views/login";
import { Main } from "../views/main";
import { Dashboard } from "../views/dashboard";
import { Forms } from "../views/forms";
import { Dispatches } from "../views/dispatches";
import { Settings } from "../views/settings";
import { FormSummary } from "../views/form-summary";
import { FormReview } from "../views/form-review";
import { FormCapture } from "../views/form-capture";
import { RESTClient} from "../services/rest-client";
import { DBClient } from "../services/db-client";
import { PushClient } from "../services/push-client";
import { SyncClient } from "../services/sync-client";
import { BussinessClient } from "../services/business-service";
import { IonPullUpComponent } from '../components/ion-pullup';
import { FormView } from '../components/form-view';
import { BusinessCard, Image, SimpleName, Signature, Gps } from "../components/form-view/elements";
import { ArrayFilterPipe } from '../pipes/filter-pipe';
import {ProspectSearch} from "../views/prospect-search";
import { TextMaskModule } from 'angular2-text-mask';
import { SignaturePadModule } from 'angular2-signaturepad';
//import { CustomFormsModule } from 'ng2-validation';

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
	FormView,
	SimpleName,
	Image,
	Signature,
	Gps,
	BusinessCard,
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
	SimpleName,
	Image,
	Signature,
	Gps,
	BusinessCard,
	ProspectSearch
  ],
  providers: [
    DBClient,
    RESTClient,
    PushClient,
    SyncClient,
	BussinessClient
  ]
})
export class AppModule { }
