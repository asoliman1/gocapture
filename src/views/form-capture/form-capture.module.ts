import { ComponentsModule } from './../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormCapture } from './form-capture';
import { PipesModule } from '../../pipes/pipes.module';
import { FormComponentsModule } from '../../components/form-view/form-components.module';

@NgModule({
  declarations: [
    FormCapture,
  ],
  imports: [
    IonicPageModule.forChild(FormCapture),
    TranslateModule,
    PipesModule,
    FormComponentsModule,
    ComponentsModule,
  ]

})
export class FormCapturePageModule {}
