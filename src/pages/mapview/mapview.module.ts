import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapviewPage } from './mapview';

@NgModule({
  declarations: [
    MapviewPage,
  ],
  imports: [
    IonicPageModule.forChild(MapviewPage),
  ],
})
export class MapviewPageModule {}
