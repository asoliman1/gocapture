import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subscription } from "rxjs/Subscription";
import {
  DeviceFormMembership,
  Form,
  User
} from '../model';
import { DBClient } from './db-client';
import { RESTClient } from './rest-client';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs';

declare var cordova;
@Injectable()
/**
 * The client to rule them all. The BussinessClient connects all the separate cients and creates
 * usable action flows. For example, authentication is a complex flow consisting of the actual auth
 * profile photos download, saving the registration response to the local database and starting up
 * the initial sync.
 *
 */
export class BussinessClient {

  protected networkSource: BehaviorSubject<"ON" | "OFF">;
  /**
   * Error event
   */
  network: Observable<"ON" | "OFF">;

  private networkOn: Subscription;
  private networkOff: Subscription;

  online: boolean = true;

  registration: User;


  private errorSource: BehaviorSubject<any>;

  /**
   * Error event
   */
  error: Observable<any>;

  public userUpdates: Subject<User> = new Subject();

  constructor(
    private db: DBClient,
    private rest: RESTClient,
    private net: Network,
    private geolocation: Geolocation,
    ) {
    this.networkSource = new BehaviorSubject<"ON" | "OFF">(null);
    this.network = this.networkSource.asObservable();
    this.errorSource = new BehaviorSubject<any>(null);
    this.error = this.errorSource.asObservable();
    this.initNetwork();
  }

  public isOnline(): boolean {
    return this.online;
  }

  private async setOnline(val: boolean) {
    this.online = val;
    this.networkSource.next(val ? "ON" : "OFF");
    this.rest.setOnline(val);
  }

  private initNetwork() {
    this.networkOff = this.net.onDisconnect().subscribe(() => {
      console.log("network was disconnected :-(");
      this.setOnline(false);
    });

    this.networkOn = this.net.onConnect().subscribe(() => {
      console.log("network was connected");
      this.setOnline(true);
    });
  }

  // A.S
 async getLocation() {
     let location : any = await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
     location = this.setLocationParams(location);
     return location;
  }

  setLocationParams(position) {
    let location: any = {};
    let coords: any = {};
    coords.latitude = position.coords.latitude;
    coords.longitude = position.coords.longitude;
    coords.altitude = position.coords.altitude;
    coords.accuracy = position.coords.accuracy;
    coords.altitudeAccuracy = position.coords.altitudeAccuracy;
    coords.heading = position.coords.heading;
    coords.speed = position.coords.speed;
    location.coords = coords;
    location.timestamp = position.timestamp;
    return location;
  }



}
