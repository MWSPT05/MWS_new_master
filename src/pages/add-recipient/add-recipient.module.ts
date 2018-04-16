import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddRecipientPage } from './add-recipient';

@NgModule({
  declarations: [
    AddRecipientPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRecipientPage),
  ],
})
export class AddRecipientPageModule {}
