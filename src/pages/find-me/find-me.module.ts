import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindMePage } from './find-me';

@NgModule({
  declarations: [
    FindMePage,
  ],
  imports: [
    IonicPageModule.forChild(FindMePage),
  ],
})
export class FindMePageModule {}
