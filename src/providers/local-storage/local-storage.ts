import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageProvider {
  private storage = localStorage;

  constructor() {

  }

  get(key) {
    return this.storage.getItem(key);
  }

  set(key, value) {
    this.storage.setItem(key, value);
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clearStorage() {
    this.storage.clear();
  }

}
