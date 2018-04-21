import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { FindMeFirebaseProvider } from '../providers/find-me-firebase/find-me-firebase';

import { UniqueDeviceID  } from '@ionic-native/unique-device-id';
import { Geolocation } from '@ionic-native/geolocation';
import { FcmProvider } from '../providers/fcm/fcm';
import { HttpClientModule } from '@angular/common/http';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { GeoProvider } from '../providers/geo/geo';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

const firebase = {
  apiKey: "AIzaSyB-Y3aJhcFbEuMnaeO5pnr2F5i0FpN6owM",
  authDomain: "masterclass-7fdb8.firebaseapp.com",
  databaseURL: "https://masterclass-7fdb8.firebaseio.com",
  projectId: "masterclass-7fdb8",
  storageBucket: "masterclass-7fdb8.appspot.com",
  messagingSenderId: "271473028429"
 }

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SigninPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebase), 
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FindMeFirebaseProvider,
    UniqueDeviceID,
    BackgroundGeolocation,
    Geolocation,
    Firebase,
    FcmProvider,
    GeoProvider
  ]
})
export class AppModule {}
