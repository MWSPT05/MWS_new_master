import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Recipient } from '../../model/recipient';

@IonicPage({
  name: 'add-recipient'
})
@Component({
  selector: 'page-add-recipient',
  templateUrl: 'add-recipient.html',
})
export class AddRecipientPage {
  public recipient: Recipient = 
  { 
  displayName: "", 
  mobileNo: "",
  devToken: ""
  };

  //recipient: Profile = {displayName: '', mobileNo: '', homeLatitude: '', homeLongitude: ''}

  constructor(public navCtrl: NavController, public navParams: NavParams, public prov: FindMeFirebaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecipientPage');
  }

  addRecipient(recipient: Recipient)
  {
    this.prov.addRecipient(recipient);
    this.navCtrl.pop();
  }

}
