import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsListPage } from './documents-list';

@NgModule({
  declarations: [
    DocumentsListPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentsListPage),
  ],
})
export class DocumentsListPageModule {}
