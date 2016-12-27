import { Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormElement } from "../../../model";
import { FormGroup, ControlValueAccessor } from "@angular/forms";
import { Observable, Observer, Subscription } from "rxjs";
import { File, Entry } from 'ionic-native';

export class BaseElement implements OnChanges, ControlValueAccessor {

	element: FormElement;
	name: string;
	formControlName: string;

	propagateChange:any = () => {};
    validateFn:any = () => {};

	currentValue: any = "";

	constructor() {

	}

	ngOnChanges(changes: SimpleChanges){
		if(this.element){
			this.name = this.element.id + "";
			this.formControlName = this.element["identifier"];
		}
	}

	writeValue(obj: any): void{
		this.currentValue = obj;
	}
	
    registerOnChange(fn: any): void{
		this.propagateChange = fn;
	}

    registerOnTouched(fn: any): void{

	}
	
    setDisabledState?(isDisabled: boolean): void{

	}

	onChange(value){
		this.currentValue = value;
		this.propagateChange(value);
	}

	moveFile(filePath: string, newFolder: string) : Observable<string>{
		return new Observable<string>((obs: Observer<string>) => {
				let name = filePath.substr(filePath.lastIndexOf("/") + 1);
				let ext = name.split(".").pop();
				let oldFolder = filePath.substr(0, filePath.lastIndexOf("/"));
				let newName = new Date().getTime() + "." + ext;
				console.log(newFolder, newName);
				let doMove = (d) =>{
					console.log("HEllo", d);
					File.moveFile(oldFolder, name, newFolder, newName)
					.then(entry => {
						obs.next(newFolder + "/" + newName);
						obs.complete();
					})
					.catch(err => {
						obs.error(err);
					});
				}
				console.log(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1));
				File.createDir(newFolder.substring(0, newFolder.lastIndexOf("/")), newFolder.substr(newFolder.lastIndexOf("/") + 1), false)
				.then(doMove)
				.catch(doMove);
		});
	}
}