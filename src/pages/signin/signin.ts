import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';

import { UniqueDeviceID  } from '@ionic-native/unique-device-id';

import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { FcmProvider } from '../../providers/fcm/fcm';
import { GeoProvider } from '../../providers/geo/geo';
import { Profile } from '../../model/profile';

@IonicPage({
  name: 'sign-in'
})

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})

export class SigninPage {

  loader = null;
  profileLoaded = false;
  deviceId: string = "6408d7ab-f6c8-9236-3524-740736165358";
  //deviceId: string = "TESTDEVICE01";
  //deviceId: string = "TESTDEVICE02";
  prevData: Profile;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public prov: FindMeFirebaseProvider, 
    private uniqueDeviceID: UniqueDeviceID,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public fcm: FcmProvider,
    public geo: GeoProvider
    
  ) {
    //this.profileRef.set(null);
    //this.prov.addNotifications();
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log("Can get uid: " + uuid)
        this.deviceId = uuid;
        this.prov.deviceId = this.deviceId;
        this.prov.register(this.registerSuccess, this);
        this.profileLoaded = true;
      })
      .catch((error: any) => 
      {
        console.log("Cannot get uid: " + error)
        this.prov.deviceId = this.deviceId;
        this.prov.register(this.registerSuccess, this);
        this.profileLoaded = true;
      });
    });
  }

  registerSuccess(loadedData: Profile, self)
  {
    self.prevData = Object.assign(<Profile>{}, loadedData);
    self.fcm.getToken();
    self.geo.getCurrentLocation(true, self.locationLoaded, self);
  }

  locationLoaded(self)
  {
    if (self.prov.data.isFinding) self.signIn();
  }

  signIn() {
    //console.log(this.prevData);
    this.prov.updataPersonalData();
    this.prov.updataCurrentLocation();
    this.prov.updateMobileNo(this.prevData.mobileNo);
    this.navCtrl.setRoot(HomePage);
  }

  setCurrentLocation()
  {
    this.prov.data.homeLatitude = this.prov.currentLoc.latitude.toFixed(6);
    this.prov.data.homeLongitude = this.prov.currentLoc.longitude.toFixed(6);
  }
}