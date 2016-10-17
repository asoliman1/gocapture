import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
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
import { RESTClient, DBClient, PushClient, SyncClient, BussinessClient } from "../services";
import { IonPullUpComponent } from '../components/ion-pullup';
import { FormView } from '../components/form-view';
import { SimpleName } from '../components/simple-name';
import { ArrayFilterPipe } from '../pipes/filter-pipe';
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
	SimpleName
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
	SimpleName
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
