import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { FcmProvider } from '../../providers/fcm/fcm';
import { GeoProvider } from '../../providers/geo/geo';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  buttonColor: string = '#FFF'; //Default Color
  deviceWidth: string = "200px";  // Circle Size of Find Me
  findMeText: string = "Find Me";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    platform: Platform,
    public prov: FindMeFirebaseProvider,
    public fcm: FcmProvider,
    public geo: GeoProvider) {

    platform.ready().then((readySource) => {
      this.calculateDeviceWidth(platform.width(), platform.height());
    });
  }

  onResize(event) {
    this.calculateDeviceWidth(event.target.innerWidth, event.target.innerHeight);
  }

  calculateDeviceWidth(width: number, height: number) {
    let w: number = width / 3;
    let h: number = height / 3;
    if (w > h) w = h;
    if (w < 200) w = 200;
    //console.log('Width: ' + w);
    this.deviceWidth = "" + w + "px";
  }

  findMe() {
    this.buttonColor = "#345465"; //desired Color

    if (this.findMeText == "Finding You...") {
      this.findMeText = "Find Me";
      this.buttonColor = "#FFF";
      this.prov.data.isFinding = false;
      this.geo.stopTracking();
    }
    else {
      this.findMeText = "Finding You...";
      this.buttonColor = "#345465";
      this.prov.data.isFinding = true;
      this.geo.stopTracking();
      this.geo.startTracking(null, null);
      this.prov.addNotifications(this.sendNotification, this);
    }

    this.prov.updataPersonalData();
  }

  sendNotification(notice, self)
  {
    console.log('send notification: ' + notice.deviceId + ': ' + notice.token);
    self.fcm.sendNotifications(notice.token, 'Find Me App', 'Requested to find ' + self.prov.data.displayName, self.prov.deviceId);
  }

  setting() {
    this.navCtrl.push('setting');
  }

  bringMeHome() {
    this.navCtrl.push('map-locator', { condition: "Bring Me Home" });
  }

  notifications() {
    this.navCtrl.push('notifications');
  }

  ionViewDidEnter() {
    if (this.prov.data.isFinding) {
      this.findMeText = "Finding You...";
      this.buttonColor = "#345465";
      this.geo.stopTracking();
      this.geo.startTracking(null, null);
    }
    else {
      this.findMeText = "Find Me";
      this.buttonColor = "#FFF";
      this.geo.stopTracking();
    }
  }
}
