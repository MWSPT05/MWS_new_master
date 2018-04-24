import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { MapviewPage } from '../mapview/mapview';

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

  ) {  
    platform.ready().then((readySource) => {
      this.calculateDeviceWidth(platform.width(), platform.height());
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindMePage');
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
    //  this.watchMe();
    }
    else {
      this.notifdb.push({displayName : this.prov.profile.displayName, date: new Date().toISOString()});
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

 /* watchMe() {
    let watchId = this.geolocation.watchPosition(this.geoLocationOptions);
    let moveImage = "assets/imgs/person1.png";
    watchId.subscribe((pos) => {
      //this.marker.setMap(null);
      //let updLocation = new google.maps.LatLng(pos.coords.latitude, 
      //                                         pos.coords.longitude);
      //
      //var strCoord = this.addtlInfo (data.coords.latitude.toFixed(4), 
      //                               data.coords.longitude.toFixed(4));
      //var strLati = parseFloat(data.coords.latitude + ' ');
      //var strLong = parseFloat(data.coords.longitude + ' ');
      //var strCoord = 'Name = <b>' + this.myName + '</b> <br/>' + 
      //               'Tel/HP = ' + this.myTelnbr + '<br/>'     +
      //               '(click on icon to call HP) <br/>' + 
      //               'Lat = ' + strLati + ', Long = ' + strLong;

      //this.moveMarker(updLocation, moveImage);

      this.prov.data.move2Lati = pos.coords.latitude + '';
      this.prov.data.move2Long = pos.coords.longitude + '';
      this.prov.updatePersonalData();

      //console.log('new loc = ', this.prov.data.move2Lati + ', ' + this.prov.data.move2Long);
    });
  } */
}
