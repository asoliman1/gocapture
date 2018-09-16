import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessCardOverlayPage } from './business-card-overlay';

@NgModule({
  declarations: [
    BusinessCardOverlayPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessCardOverlayPage),
  ],
})
export class BusinessCardOverlayPageModule {}
