import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapFinderPage } from './map-finder';

@NgModule({
  declarations: [
    MapFinderPage,
  ],
  imports: [
    IonicPageModule.forChild(MapFinderPage),
  ],
})
export class MapFinderPageModule {}
