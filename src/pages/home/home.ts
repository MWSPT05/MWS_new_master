import { Component, ApplicationModule } from '@angular/core';
import { Platform, NavController, NavParams, App, MenuController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { MapviewPage } from '../mapview/mapview';
//import { MenuPage } from '../menu/menu';

//import { FindMePage } from '../find-me/find-me';
import { Geolocation } from '@ionic-native/geolocation';
declare var FCMPlugin;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  buttonColor: string = '#FFF'; //Default Color
  deviceWidth: string = "200px";  // Circle Size of Find Me
  findMeText: string = "Find Me";
  watchId: any;

  private notifdb = this.db.list('notification');
 
  geoLocationOptions = {
    maximumAge: 3000,
    enableHighAccuracy: true
  }; 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    platform: Platform,
    public geolocation: Geolocation,
    public prov: FindMeFirebaseProvider,
    private db: AngularFireDatabase,
    public menu: MenuController
  ) {  
    platform.ready().then((readySource) => {
      this.calculateDeviceWidth(platform.width(), platform.height());
    });
  }

  ionViewDidEnter() {
    this.menu.enable(true, 'menu1');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FindMePage');
   // this.userid = this.navParams.get('data');
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
    console.log('in findMe() module');

    // this.buttonColor = (this.buttonColor == '#345465'? "#FFF" : "345465"); //desired Color
    //this.findMeText = (this.findMeText == "Find Me" ? "Finding You..." : "Find Me");
    //this.navCtrl.push(FindMePage);

    this.buttonColor = "#345465"; //desired Color
    if (this.findMeText == "Finding You...") {
      this.findMeText = "Find Me";
      this.buttonColor = "#FFF";
      this.watchId.unsubscribe();
      this.prov.profile.isFinding = false;
      this.prov.profile.move2Lati = '';
      this.prov.profile.move2Long = '';
      this.prov.updatePersonalData();
    }
    else {
      //this.notifdb.push({displayName : this.prov.profile.displayName, date: new Date().toISOString()});
      this.prov.addNotification();
      FCMPlugin.onNotification(function(data){
        if(data.wasTapped){
          //Notification was received on device tray and tapped by the user.
          alert( JSON.stringify(data) );
        }else{
          //Notification was received in foreground. Maybe the user needs to be notified.
          alert( JSON.stringify(data) );       
        }
      });
      this.findMeText = "Finding You...";
      this.buttonColor = "#345465"
      this.watchMe();
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

  watchMe() {
    this.watchId = this.geolocation.watchPosition().subscribe((pos) => {
      this.prov.profile.move2Lati = pos.coords.latitude + '';
      this.prov.profile.move2Long = pos.coords.longitude + '';
      this.prov.profile.isFinding = true;
      this.prov.updatePersonalData();
    });
  }

  //callMenu() {
  //  this.navCtrl.push(MenuPage);
  //}

  gotoPage(p) {
    this.navCtrl.push(p);
  }

}
