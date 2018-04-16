import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapLocatorPage } from './map-locator';

@NgModule({
  declarations: [
    MapLocatorPage,
  ],
  imports: [
    IonicPageModule.forChild(MapLocatorPage),
  ],
})
export class MapLocatorPageModule {}
