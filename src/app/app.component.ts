import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SigninPage } from '../pages/signin/signin';
import * as firebase from 'Firebase';

const config = {
  apiKey: "AIzaSyB-Y3aJhcFbEuMnaeO5pnr2F5i0FpN6owM",
  authDomain: "masterclass-7fdb8.firebaseapp.com",
  databaseURL: "https://masterclass-7fdb8.firebaseio.com",
  projectId: "masterclass-7fdb8",
  storageBucket: "masterclass-7fdb8.appspot.com",
  messagingSenderId: "271473028429"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen
    ) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(config);
  }
}

