import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { HomePage } from '../pages/home/home';

import { FIREBASE_CONFIG } from './firebase.credentials';
import { SigninPage } from '../pages/signin/signin';
import * as firebase from 'Firebase';

import { Geolocation } from '@ionic-native/geolocation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;

  constructor(
    public zone: NgZone,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public geolocation: Geolocation
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}

