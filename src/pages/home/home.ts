import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';

import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { MapviewPage } from '../mapview/mapview';

import { FindMePage } from '../find-me/find-me';

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
    public prov: FindMeFirebaseProvider
  ) {  
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
    // this.buttonColor = (this.buttonColor == '#345465'? "#FFF" : "345465"); //desired Color
    //this.findMeText = (this.findMeText == "Find Me" ? "Finding You..." : "Find Me");
    console.log('in findMe() module');
    this.buttonColor = "#345465"; //desired Color
    this.navCtrl.push(FindMePage);

    if (this.findMeText == "Finding You...") {
      this.findMeText = "Find Me";
      this.buttonColor = "#FFF";
    }
    else {
      this.findMeText = "Finding You...";
      this.buttonColor = "#345465"
    }
  }

  setting()
  {
    this.navCtrl.push('setting');
  }

  bringMeHome() {
    //this.navCtrl.push('map-locator', { condition: "Bring Me Home" });
    this.navCtrl.push(MapviewPage, { condition: "Bring Me Home" });
  }

  notifications()
  {
    this.navCtrl.push('notifications');
  }

}
