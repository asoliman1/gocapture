import { FormCapture } from './../views/form-capture/form-capture';
import { IonicStorageModule } from '@ionic/storage';
import { ActivationViewPage } from './../pages/activation-view/activation-view';
import { Keyboard } from '@ionic-native/keyboard';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyApp } from './app.component';
import { FormSummary } from "../views/form-summary";
import { FormInstructions } from "../views/form-instructions";
import { RESTClient } from "../services/rest-client";
import { DBClient } from "../services/db-client";
import { BussinessClient } from "../services/business-service";

import { Insomnia } from '@ionic-native/insomnia';
import { TextMaskModule } from 'angular2-text-mask';
import { Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { HttpService } from '../util/http';
import { MyCurrencyDirective } from "../util/currency";
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Device } from "@ionic-native/device";
import { Push } from '@ionic-native/push';
import { Network } from '@ionic-native/network';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { Clipboard } from '@ionic-native/clipboard';
import { AppVersion } from '@ionic-native/app-version';
import { Geolocation } from "@ionic-native/geolocation";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { StatusBar } from "@ionic-native/status-bar";
import { Popup } from '../providers/popup/popup';
import { IonicApp } from 'ionic-angular/components/app/app-root';
import { IonicModule } from 'ionic-angular/module';
import { Util } from "../util/util";
import { HTTP } from "@ionic-native/http";
import { ThemeProvider } from '../providers/theme/theme';
import { PipesModule } from '../pipes/pipes.module';
import { Ndef, NFC } from "@ionic-native/nfc";
import { Media } from "@ionic-native/media";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { WheelSelector } from "@ionic-native/wheel-selector";
import { Vibration } from "@ionic-native/vibration";
import { AppPreferences } from "@ionic-native/app-preferences";
import { DocumentViewer } from "@ionic-native/document-viewer";
import { FileOpener } from "@ionic-native/file-opener";
import { SocialSharing } from "@ionic-native/social-sharing";
import { StationsPage } from "../views/stations/stations";
import { IonicImageLoader } from "ionic-image-loader";
import { ScreenSaverPage } from '../pages/screen-saver/screen-saver';
import { formViewService } from '../components/form-view/form-view-service';
import { FormsProvider } from '../providers/forms/forms';
import { SubmissionsProvider } from '../providers/submissions/submissions';
import { Intercom } from '@ionic-native/intercom';
import { ActivationsProvider } from '../providers/activations/activations';
import { TranslateConfigService } from '../services/translate/translateConfigService';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormComponentsModule } from '../components/form-view/form-components.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    FormCapture,
    FormSummary,
    FormInstructions,
    MyCurrencyDirective,
    StationsPage,
    ScreenSaverPage,
    ActivationViewPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: false
    }),
    BrowserAnimationsModule,
    TextMaskModule,
    PipesModule,
    IonicImageLoader.forRoot(),
    FormComponentsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FormCapture,
    FormSummary,
    FormInstructions,
    StationsPage,
    ScreenSaverPage,
    ActivationViewPage,
  ],
  exports: [],
  providers: [
    DBClient,
    RESTClient,
    BussinessClient,
    FileTransfer,
    File,
    Device,
    HTTP,
    Push,
    Network,
    Camera,
    SQLite,
    Clipboard,
    AppVersion,
    Geolocation,
    BarcodeScanner,
    NFC,
    Ndef,
    StatusBar,
    ScreenOrientation,
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    },
    Popup,
    Util,
    ThemeProvider,
    Media,
    PhotoViewer,
    PhotoLibrary,
    LocalNotifications,
    WheelSelector,
    Vibration,
    FormsProvider,
    AppPreferences,
    DocumentViewer,
    FileOpener,
    SocialSharing,
    Insomnia,
    SubmissionsProvider,
    formViewService,
    Keyboard,
    Intercom,
    ActivationsProvider,
    TranslateConfigService,
  ]
})
export class AppModule { }

export function httpFactory(backend: XHRBackend, options: RequestOptions) {
  return new HttpService(backend, options);
}
