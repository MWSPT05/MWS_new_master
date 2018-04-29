import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { UniqueDeviceID  } from '@ionic-native/unique-device-id';
//import { Geolocation } from '@ionic-native/geolocation';

import { HomeLocationPage } from '../home-location/home-location';
import { HomePage } from '../home/home';

declare var FCMPlugin;

@IonicPage({
  name: 'sign-in'
})

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})

export class SigninPage {
  
  loader = null;
  currDevId: any;
  //fbData: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public prov: FindMeFirebaseProvider, 
    private uniqueDeviceID: UniqueDeviceID,
    public platform: Platform,
    public alertCtrl: AlertController,
  ) {   }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.uniqueDeviceID.get()
      .then((uuid: any) => {
        //console.log("Can get uid: " + uuid)
        this.prov.profile.deviceID = uuid;
        this.currDevId = uuid;
      }).catch((error: any) => 
      {
        //this.prov.profile.deviceID = '9125bd75-ff89-6a63-8640-480304327978';
        //console.log("Cannot get uid: " + error + ' ' + this.prov.profile.deviceID)
      });
    });
  }

  signIn() {
    //var fbData = this.prov.chkIfUserExist().then(() => {
    var fbData = this.prov.chkIfUserExist(this.prov.profile.displayName, this.prov.profile.mobileNo).then(() => {
      //this.prov.profile.deviceID = this.currDevId;
      this.doSignin();
    });
  }

  doSignin() {
    if (this.platform.is('android')) {
        this.tokensetup().then((token) => { this.prov.profile.devToken = <string> token; });
    }

    if (this.prov.userExist == 'N') {
      this.prov.addProfile();
      this.navCtrl.push(HomeLocationPage);
    } else {
        console.log('device id = ', this.currDevId + ' ' + this.prov.profile.deviceID)
        if (this.currDevId != this.prov.profile.deviceID) {
          this.prov.profile.deviceID = this.currDevId;
          this.prov.updatePersonalData();
        }
        this.navCtrl.setRoot(HomePage);
    }
  }

  tokensetup() {
    var promise = new Promise((resolve, reject) => {
      FCMPlugin.getToken(function(token){
        resolve(token);
      }, (err) => {
        reject(err);
      });
    })
    return promise;
  }


}