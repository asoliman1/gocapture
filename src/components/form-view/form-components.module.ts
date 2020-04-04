import { IonicModule } from 'ionic-angular/module';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';

import { DynamicFormElementComponent } from './dynamic-form-element/dynamic-form-element';
import { FormView } from './form-view';
import { Address } from './elements/address';
import { Gps } from './elements/gps';
import { Checkboxes } from './elements/checkboxes';
import { Radios } from './elements/radios';
import { Dropdown } from './elements/dropdown';
import { SimpleName } from './elements/simple-name/simple-name';
import { SectionBlock } from './section-block/section-block';
import { Document } from './elements/document';
import { HTMLBlock } from './elements/html-block';


@NgModule({
  declarations: [
    Gps,
    Address,
    Checkboxes,
    Radios,
    Dropdown,
    Document,
    SectionBlock,
    SimpleName,
    HTMLBlock,
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
    Address,
    Gps,
    Checkboxes,
    Radios,
    Dropdown,
    HTMLBlock,
    Document,
    SectionBlock,
    SimpleName,
    HTMLBlock,
    DynamicFormElementComponent,
    FormView,
  ]

})
export class FormComponentsModule {}
