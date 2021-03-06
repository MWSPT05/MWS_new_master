import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { UniqueDeviceID  } from '@ionic-native/unique-device-id';
import { Geolocation } from '@ionic-native/geolocation';

import { HomeLocationPage } from '../home-location/home-location';

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
  deviceId: string = "TESTDEVICEID";
  prevData = { displayName: "", mobileNo: "", condition: "" };
  
  locationName: string;
  locationAddr: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public prov: FindMeFirebaseProvider, 
    private uniqueDeviceID: UniqueDeviceID,
    public platform: Platform,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController
  ) {
    //this.profileRef.set(null);
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

  registerSuccess(loadedData, self)
  {
    self.prevData = loadedData;
  }

  signIn() {
    //console.log(this.prevData);
    this.prov.updatePersonalData();
    this.prov.updateMobileNo(this.prevData.mobileNo);

    if(this.prov.data.homeLatitude == '' || this.prov.data.homeLongitude == '') {
      this.navCtrl.push(HomeLocationPage);
      //this.navCtrl.push(HomePage);
      //this.navCtrl.setRoot(HomePage);
    }
    else {
      //this.navCtrl.push(HomePage);
      this.navCtrl.setRoot(HomePage);
    }
  }

  //setCurrentLocation()
  //{
  //  this.loader = this.loadingCtrl.create({
  //    content: "Retrieving current location..."
  //  });
  //  //Show the loading indicator
  //  this.loader.present();
  //
  //  this.geolocation.getCurrentPosition().then(pos => {
  //    this.prov.data.homeLatitude = pos.coords.latitude.toFixed(6);
  //    this.prov.data.homeLongitude = pos.coords.longitude.toFixed(6);
  //  });
  //
  //  if (this.loader !== null) this.loader.dismiss();
  //}

  setCurrentLocation() {
    console.log('setCurrentLocation');
    this.navCtrl.push(HomeLocationPage);
    //this.locationName = localStorage.getItem('locName');
    //this.locationAddr = localStorage.getItem('locAddr');
  }
}
