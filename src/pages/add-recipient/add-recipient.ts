import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Profile } from '../../model/profile';

@IonicPage({
  name: 'add-recipient'
})
@Component({
  selector: 'page-add-recipient',
  templateUrl: 'add-recipient.html',
})
export class AddRecipientPage {

  recipient: Profile = {displayName: '', mobileNo: '', homeLatitude: '', homeLongitude: ''}

  constructor(public navCtrl: NavController, public navParams: NavParams, public prov: FindMeFirebaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRecipientPage');
  }

  addRecipient()
  {
    this.prov.addRecipient(this.recipient);
    this.navCtrl.pop();
  }

}
