import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { ActivationItemComponent } from './activation-item/activation-item';
import { SkeletonLoadingComponent } from './skeleton-loading/skeleton-loading';
@NgModule({
  declarations: [
    ActivationItemComponent,
    SkeletonLoadingComponent,
  ],
  imports: [
    IonicModule,
    TranslateModule
  ],
  exports: [
    ActivationItemComponent,
    SkeletonLoadingComponent,
  ]
})
export class ComponentsModule { }
