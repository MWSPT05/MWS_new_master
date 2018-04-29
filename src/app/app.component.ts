import { Component, NgZone, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FIREBASE_CONFIG } from './firebase.credentials';
import * as firebase from 'Firebase';

import { Geolocation } from '@ionic-native/geolocation';

//pages
import { SigninPage } from '../pages/signin/signin';
//import { AddRecipientPage } from '../pages/add-recipient/add-recipient';
import { HomeLocationPage } from '../pages/home-location/home-location';
//import { SettingPage } from '../pages/setting/setting';

 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;

  @ViewChild(Nav) nav: Nav;

  constructor(
    public zone: NgZone,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public geolocation: Geolocation,
    public alertCtrl: AlertController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  //public appAddRecipient() {
  //  this.nav.push(SettingPage);
  //}

  public appEditAddress() {
    this.nav.push(HomeLocationPage);
  }

  public appLogout() {
    this.nav.setRoot(SigninPage);
  }

  public appAbout() {
    let alert = this.alertCtrl.create({
      title: 'About this App',
      subTitle: 'The FindMe! app was designed by ' +
                'combined part-time Masters ' +
                'students from SE and KE.<br/>' +
                '(1) Chin Weng Khin (KE)<br/>' + 
                '(2) Eric Rivas Gutierrez (SE)<br/>' +
                '(3) Lim Kim Chwee (KE)<br/>' + 
                '(4) Mylyn Tanzon Tayong (SE) <br/><br/>' +
                '(c) April 2018. <br/>' ,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}

