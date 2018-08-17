import { Platform } from "ionic-angular/platform/platform";
import { normalizeURL } from 'ionic-angular/util/util';
import {Injectable} from "@angular/core";
import { File } from '@ionic-native/file';

/**
 * Jquery clone
 */

@Injectable()
export class Util {

  private static arr : Array<string> = [];
  private static slice: Function = Util.arr.slice;
  private static class2type : any = {
    "[object Boolean]" : "boolean",
    "[object Number]" : "number",
    "[object String]" : "string",
    "[object Function]" : "function",
    "[object Array]" : "array",
    "[object Date]" : "date",
    "[object RegExp]" : "regexp",
    "[object Object]" : "object",
    "[object Error]" : "error",
    "[object Symbol]" : "symbol"
  };

  //private static toString : Function = Util.class2type.toString;
  private static hasOwn : Function = Util.class2type.hasOwnProperty;

  constructor(private platform: Platform, private file: File) {
    //
  }

  public static each( obj : any, callback: (element: any, index : number, context: any) => any) {
    let length : number, i : any = 0;

    if ( Util.isArrayLike( obj ) ) {
      length = obj.length;
      for ( ; i < length; i++ ) {
        if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
          break;
        }
      }
    } else {
      for ( i in obj ) {
        if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
          break;
        }
      }
    }
    return obj;
  }


  public static proxy(fn : Function, context : any ) {
    let args, proxy, tmp;

    if ( typeof context === "string" ) {
      tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !Util.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    args = Util.slice.call( arguments, 2 );
    proxy = function() {
      return fn.apply( context || Util, args.concat( Util.slice.call( arguments ) ) );
    };

    return proxy;
  }

  public static isFunction( obj :any ) : boolean {
    return Util.type( obj ) === "function";
  }

  public static isArray( obj :any ) : boolean {
    return Array.isArray(obj);
  }

  public static isWindow( obj :any ) : boolean {
    return obj != null && obj == obj.window;
  }

  public static isNumeric( obj : any ) : boolean {
    let realStringObj = obj && obj.toString();
    return !Util.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
  }

  public static isEmptyObject( obj : any ) : boolean {
    let name;
    for ( name in obj ) {
      return false;
    }
    return true;
  }

  public static isPlainObject( obj :any ) : boolean {
    let key;

    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || Util.type( obj ) !== "object" || obj.nodeType || Util.isWindow( obj ) ) {
      return false;
    }

    try {

      // Not own constructor property must be Object
      if ( obj.constructor &&
        !Util.hasOwn.call( obj, "constructor" ) &&
        !Util.hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
        return false;
      }
    } catch ( e ) {

      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    for ( key in obj ) {}

    return key === undefined || Util.hasOwn.call( obj, key );
  }

  public static type( obj  :any ) : string {
    if ( obj == null ) {
      return obj + "";
    }
    return typeof obj === "object" || typeof obj === "function" ?
      Util.class2type[ toString.call( obj ) ] || "object" :
      typeof obj;
  }


  private static isArrayLike( obj : any ) : boolean {
    let length = !!obj && "length" in obj && obj.length,
      type = Util.type( obj );

    if ( type === "function" || Util.isWindow( obj ) ) {
      return false;
    }

    return type === "array" || length === 0 ||
      typeof length === "number" && length > 0 && ( length - 1 ) in obj;
  }

  public normalizeURL(url: string): string{
    return this.platform.is('ios') ? normalizeURL(url) : url;
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

}
