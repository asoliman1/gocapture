import { IonicModule } from 'ionic-angular/module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';

import { buttonBar } from '../../components/form-view/button-bar/button-bar';
import { DynamicFormElementComponent } from './dynamic-form-element/dynamic-form-element';
import { CustomFabMenu } from './fab-list/fab-list';
import { FormView } from './form-view';
import { Address } from './elements/address';
import { Badge } from './elements/badge';
import { BusinessCard, ImageViewer } from './elements/business-card';
import { Signature, SignatureModal, SignaturePad } from './elements/signature';
import { Gps } from './elements/gps';
import { Checkboxes } from './elements/checkboxes';
import { Radios } from './elements/radios';
import { Dropdown } from './elements/dropdown';
import { Image } from './elements/Image';
import { SimpleName } from './elements/simple-name/simple-name';
import { SectionBlock } from './section-block/section-block';
import { Document } from './elements/document';
import { HTMLBlock } from './elements/html-block';
import { GOCAudio } from './elements/audio/goc-audio';


@NgModule({
  declarations: [
    buttonBar,
    CustomFabMenu,
    BusinessCard,
    Image,
    Signature,
    SignatureModal,
    SignaturePad,
    Gps,
    Address,
    Checkboxes,
    Radios,
    Dropdown,
    Badge,
    ImageViewer,
    Document,
    SectionBlock,
    SimpleName,
    HTMLBlock,
    GOCAudio,
    DynamicFormElementComponent,
    FormView,
  ],
  imports: [
    IonicModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    PipesModule,
  ],
  exports:[
    CustomFabMenu,
    BusinessCard,
    Address,
    Image,
    Signature,
    SignatureModal,
    SignaturePad,
    Gps,
    Checkboxes,
    Radios,
    Dropdown,
    Badge,
    HTMLBlock,
    ImageViewer,
    Document,
    SectionBlock,
    SimpleName,
    HTMLBlock,
    GOCAudio,
    DynamicFormElementComponent,
    FormView,
    buttonBar
  ]

})
export class FormComponentsModule {}
