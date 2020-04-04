import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Main } from './main';

@NgModule({
  declarations: [
    Main,
  ],
  imports: [
    IonicPageModule.forChild(Main),
  ]

})
export class FormCapturePageModule {}
