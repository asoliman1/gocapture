import { Injectable } from "@angular/core";
import { DBClient } from './db-client';
import { Observable } from "rxjs";

@Injectable()

export class SettingsService {


  constructor(private db: DBClient) {
    //
  }

  public getSetting(setting): Observable<string> {
    return this.db.getConfig(setting);
  }

  public setSetting(setting, value): Observable<boolean> {
    return this.db.saveConfig(setting, value);
  }

}
