import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';

@IonicPage({
  name: 'notifications'
})
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notifications = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public prov: FindMeFirebaseProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NotificationsPage');
    this.prov.loadNotifications(this.notifications);  
  }

  mapFind(notification)
  {
    //console.log('notification = ', notification);
    //console.log('notification.key = ', notification.key);
    //console.log('notification.displayName = ', notification.displayName);
    this.navCtrl.push('map-finder', {finderId: notification.key, displayName: notification.displayName});
  }

}
