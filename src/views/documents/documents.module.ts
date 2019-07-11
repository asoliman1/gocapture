import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {Documents} from "./documents";
import {LongPressModule} from "ionic-long-press";
import {Document} from "../../components/document";

@NgModule({
  declarations: [
    Documents,
    Document
  ],
  imports: [
    IonicPageModule.forChild(Documents),
    LongPressModule
  ],
})
export class DocumentsPageModule {}
