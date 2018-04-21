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
    this.prov.loadNotifications(this.notifications);
  }

  mapFind(notification)
  {
    console.log(notification);
    this.navCtrl.push('map-finder', {finderId: notification.key, displayName: notification.displayName});
  }

  deleteNotification(key)
  {
    this.prov.deleteNotification(key);
  }
}
