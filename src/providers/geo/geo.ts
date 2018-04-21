import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

import { LoadingController, Platform } from 'ionic-angular';
import { Profile, Location } from '../../model/profile';

import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import 'rxjs/add/operator/filter';

@Injectable()
export class GeoProvider {
  constructor(
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private prov: FindMeFirebaseProvider,
    public zone: NgZone,
    private backgroundGeolocation: BackgroundGeolocation
  ) { }

  public watch: any;
  
  startTracking(call, caller) {
    console.log('start tracking');
    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.prov.currentLoc.latitude = location.latitude;
        this.prov.currentLoc.longitude = location.longitude;
        this.prov.updataCurrentLocation();
        if (call) call(caller);
      });
    }, (err) => {
      console.log(err);
    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();

    // Foreground Tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined)
    .subscribe((position: Geoposition) => {

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.prov.currentLoc.latitude = position.coords.latitude;
        this.prov.currentLoc.longitude = position.coords.longitude;
        this.prov.updataCurrentLocation();
        if (call) call(caller);
      });
    });
  }

  stopTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.finish();
    if (this.watch) this.watch.unsubscribe();
  }

  async getCurrentLocation(showLoading: boolean, callback, caller) {
    let _this = this;
    let ldr = _this.loadingCtrl.create({
      content: "Retrieving current location..."
    });

    //Show the loading indicator
    if (showLoading) ldr.present();

    await _this.geolocation.getCurrentPosition().then(pos => {
      _this.prov.currentLoc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      if (ldr !== null && showLoading) ldr.dismiss();
      if (caller) callback(caller);
    });
  }
}
