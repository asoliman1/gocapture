import { FileInfo } from './../model/protocol/file-upload-request';
import { Platform } from "ionic-angular/platform/platform";
import { Injectable } from "@angular/core";
import { File } from '@ionic-native/file';
import { Observable, Observer } from "rxjs";
import { LocalStorageProvider } from "../providers/local-storage/local-storage";

/**
 * Jquery clone
 */

@Injectable()
export class Util {

  private static arr: Array<string> = [];
  private static slice: Function = Util.arr.slice;
  private static class2type: any = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regexp",
    "[object Object]": "object",
    "[object Error]": "error",
    "[object Symbol]": "symbol"
  };

  private win: any = window;

  //private static toString : Function = Util.class2type.toString;
  private static hasOwn: Function = Util.class2type.hasOwnProperty;

  constructor(private platform: Platform,
    private file: File,
    private localStorage: LocalStorageProvider) {
    //
  }

  public static each(obj: any, callback: (element: any, index: number, context: any) => any) {
    let length: number, i: any = 0;

    if (Util.isArrayLike(obj)) {
      length = obj.length;
      for (; i < length; i++) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    }
    return obj;
  }


  public static proxy(fn: Function, context: any) {
    let args, proxy, tmp;

    if (typeof context === "string") {
      tmp = fn[context];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if (!Util.isFunction(fn)) {
      return undefined;
    }

    // Simulated bind
    args = Util.slice.call(arguments, 2);
    proxy = function () {
      return fn.apply(context || Util, args.concat(Util.slice.call(arguments)));
    };

    return proxy;
  }

  public static isFunction(obj: any): boolean {
    return Util.type(obj) === "function";
  }

  public static isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  public static isWindow(obj: any): boolean {
    return obj != null && obj == obj.window;
  }

  public static isNumber(num) {
    return !isNaN(num);
  }

  public static isNumeric(obj: any): boolean {
    let realStringObj = obj && obj.toString();
    return !Util.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
  }

  public static isEmptyObject(obj: any): boolean {
    let name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  public static isPlainObject(obj: any): boolean {
    let key;

    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if (!obj || Util.type(obj) !== "object" || obj.nodeType || Util.isWindow(obj)) {
      return false;
    }

    try {

      // Not own constructor property must be Object
      if (obj.constructor &&
        !Util.hasOwn.call(obj, "constructor") &&
        !Util.hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {

      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    for (key in obj) { }

    return key === undefined || Util.hasOwn.call(obj, key);
  }

  public static type(obj: any): string {
    if (obj == null) {
      return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
      Util.class2type[toString.call(obj)] || "object" :
      typeof obj;
  }


  private static isArrayLike(obj: any): boolean {
    let length = !!obj && "length" in obj && obj.length,
      type = Util.type(obj);

    if (type === "function" || Util.isWindow(obj)) {
      return false;
    }

    return type === "array" || length === 0 ||
      typeof length === "number" && length > 0 && (length - 1) in obj;
  }

  public normalizeURL(url: string): string {
    return this.win.Ionic.WebView.convertFileSrc(url);
  }

  public imageUrl(path) {
    //if local image
    if (path.startsWith("assets")) {
      return path;
    }
    let folder = this.file.dataDirectory + "leadliaison/images";
    let name = path.substr(path.lastIndexOf("/") + 1);
    return folder + "/" + name;
  }

  public capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  public createFile(data, name, size) {
    let entry = new FileInfo();
    let d = data.split(";base64,");
    entry.data = d[1];
    entry.name = name.split('.').shift();
    entry.size = size;

    if (entry.size == 0) {
      entry.size = atob(entry.data).length;
    }
    entry.mime_type = d[0].substr(5);
    return entry;
  }

  public moveFile(filePath: string, newFolder: string, needRename: boolean = false): Observable<string> {
    return new Observable<string>((obs: Observer<string>) => {
      let name = filePath.substr(filePath.lastIndexOf("/") + 1).split("?")[0];
      let ext = name.split(".").pop();
      let oldFolder = filePath.substr(0, filePath.lastIndexOf("/"));
      let newName = needRename ? new Date().getTime() + "." + ext : name;
      let doMove = (d) => {
        this.file.moveFile(oldFolder, name, newFolder, newName)
          .then(entry => {
            obs.next(newFolder + "/" + newName);
            obs.complete();
          })
          .catch(err => {
            obs.error(err);
          });
      };
      //console.log(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1));
      this.file.createDir(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1), false)
        .then(doMove)
        .catch(doMove);
    });
  }

  public fileExist(url) {
    let file =this.getFilePath(url, '');
    return this.file.checkFile(file.folderPath + '/', file.name);
  }

  public adjustFilePath(filePath) {
    if (this.platform.is("ios")) {

      return filePath.replace(/^file:\/\//, '');
    }
    return filePath;
  }

  public adjustImagePath(path) {
    if (!path) {
      return "";
    }
    return path.replace(/\?.*/, "") + "#" + parseInt(((1 + Math.random()) * 1000) + "")
  }

  // A.S
  private folderForFile(ext: string) {
    if (ext == '.png' || ext == '.jpg' || ext == '.heic' || ext == '.jpeg')
      return "images/";
    else if (ext == '.mp3' || ext == 'aac' || ext == 'wma' || ext == 'm4a')
      return "audio/";
    else
      return "videos/"
  }

  // A.S
  getFilePath(url, id?) {
    let isSplashImage = url.includes('https://images.unsplash.com/');
    url = isSplashImage ? url.split('?')[0] : url;
    let ext = isSplashImage ? '.jpg' : url.substr(url.lastIndexOf("."));
    let name = id + url.substr(url.lastIndexOf("/") + 1);
    let pathToDownload = encodeURI(url);
    let newFolder = this.file.dataDirectory + "leadliaison/" + this.folderForFile(ext);
    let path = newFolder + name;

    return { path, pathToDownload , name , folderPath:newFolder }
  }

  // A.S this is a setter fn for android when using plugins app start syncing as on app resume fn works
  public setPluginPrefs() {
    if (this.platform.is('android'))
      this.localStorage.set('android-plugin', true);
    else
      this.localStorage.set('android-plugin', false);
  }

  // A.S this is fn to delete after returning from plugin
  public rmPluginPrefs() {
    this.localStorage.remove('android-plugin')
  }

  // A.S check the if any plugin is used or not
  public getPluginPrefs() {
    return this.localStorage.get('android-plugin')
  }

  // A.S randomize an array
  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

}
