import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Login } from "../views/login";
import { Main } from "../views/main";
import { Dashboard } from "../views/dashboard";
import { Forms } from "../views/forms";
import { Dispatches } from "../views/dispatches";
import { Settings } from "../views/settings";
import { RESTClient, DBClient } from "../services";

let components = [
    MyApp,
    Login,
    Main,
    Dashboard,
    Forms,
    Dispatches,
    Settings
];

@NgModule({
  declarations: [].concat(components),
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [].concat(components),
  providers: [
    DBClient,
    RESTClient]
})
export class AppModule {}
