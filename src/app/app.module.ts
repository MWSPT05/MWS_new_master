import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//*******************
// used by this app *
//*******************
// -> Paul and Mylyn
import { SigninPage } from '../pages/signin/signin';
import { FindMeFirebaseProvider } from '../providers/find-me-firebase/find-me-firebase';
import { UniqueDeviceID  } from '@ionic-native/unique-device-id';
import { Geolocation } from '@ionic-native/geolocation';

import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { HttpClientModule } from '@angular/common/http';

//import { FindMePage } from '../pages/find-me/find-me';

// Kim Chwee
import { MapviewPage } from '../pages/mapview/mapview';
import { Device } from '@ionic-native/device';
//import { WatchMeRtnProvider } from '../providers/watch-me-rtn/watch-me-rtn';
import { CallNumber } from '@ionic-native/call-number';

// Eric
import { HomeLocationPage } from '../pages/home-location/home-location';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SigninPage,
    MapviewPage,
    //FindMePage,
    HomeLocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage,
    MapviewPage,
    //FindMePage,
    HomeLocationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FindMeFirebaseProvider,
    UniqueDeviceID,
    Device,
    //WatchMeRtnProvider,
    CallNumber
  ]
})
export class AppModule {}
