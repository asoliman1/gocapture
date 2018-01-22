import { OnChanges, SimpleChanges } from '@angular/core';
import { FormElement } from "../../../model";
import { ControlValueAccessor } from "@angular/forms";
import { Observable, Observer } from "rxjs";
import { File } from '@ionic-native/file';

export class BaseElement implements OnChanges, ControlValueAccessor {

  element: FormElement;
  name: string;
  formControlName: string;

  readonly: boolean = false;

  propagateChange:any = () => {};
  validateFn:any = () => {};

  currentVal: any = "";

  protected file: File;

  constructor() {
    this.file = new File();
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.element){
      this.name = this.element.id + "";
      this.formControlName = this.element["identifier"];
    }
  }

  writeValue(obj: any): void{
    this.currentVal = obj;
  }

  registerOnChange(fn: any): void{
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void{

  }

  setDisabledState?(isDisabled: boolean): void{

  }

  onChange(value){
    this.currentVal = value;
    this.propagateChange(value);
  }

  moveFile(filePath: string, newFolder: string) : Observable<string>{
    return new Observable<string>((obs: Observer<string>) => {
      let name = filePath.substr(filePath.lastIndexOf("/") + 1).split("?")[0];
      let ext = name.split(".").pop();
      let oldFolder = filePath.substr(0, filePath.lastIndexOf("/"));
      let newName = new Date().getTime() + "." + ext;
      let doMove = (d) =>{
        this.file.moveFile(oldFolder, name, newFolder, newName)
          .then(entry => {
            obs.next(newFolder + "/" + newName);
            obs.complete();
          })
          .catch(err => {
            obs.error(err);
          });
      }
      //console.log(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1));
      this.file.createDir(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1), false)
        .then(doMove)
        .catch(doMove);
    });
  }

  writeFile(newFolder: string, fileName: string, data: any) : Observable<string>{
    return new Observable<string>((obs: Observer<string>) => {
      let name = fileName.split("?")[0];
      let ext = name.split(".").pop();
      let newName = new Date().getTime() + "." + ext;
      let doWrite = (d) =>{
        this.file.writeFile(newFolder, newName, data, {replace:true})
          .then(entry => {
            obs.next(newFolder + "/" + newName);
            obs.complete();
          })
          .catch(err => {
            obs.error(err);
          });
      }
      //console.log(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1));
      this.file.createDir(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1), false)
        .then(doWrite)
        .catch(doWrite);
    });
  }

  copyFile(filePath: string, newFolder: string) : Observable<string>{
    return new Observable<string>((obs: Observer<string>) => {
      let name = filePath.substr(filePath.lastIndexOf("/") + 1).split("?")[0];
      let ext = name.split(".").pop();
      let oldFolder = filePath.substr(0, filePath.lastIndexOf("/"));
      let newName = new Date().getTime() + "." + ext;
      let doCopy = (d) =>{
        this.file.copyFile(oldFolder, name, newFolder, newName)
          .then(entry => {
            obs.next(newFolder + "/" + newName);
            obs.complete();
          })
          .catch(err => {
            obs.error(err);
          });
      }
      //console.log(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1));
      this.file.createDir(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1), false)
        .then(doCopy)
        .catch(doCopy);
    });
  }

  checkFileExistAtPath(path: string) : Observable<boolean> {
    return new Observable<boolean>((obs: Observer<boolean>) => {
      let name = path.substr(path.lastIndexOf("/") + 1).split("?")[0];
      this.file.checkFile(path, name)
        .then((isExist) => {
          obs.next(isExist);
          obs.complete();
        })
        .catch(err => {
          obs.error(err);
        })
    });
  }
}
