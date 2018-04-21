import { Component, ViewChild, ElementRef, } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Geolocation } from '@ionic-native/geolocation';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';

declare var FCMPlugin;
declare var google;

/**
 * Generated class for the FindMePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'find-me'
})
@Component({
  selector: 'page-find-me',
  templateUrl: 'find-me.html',
})
export class FindMePage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('navbar') navBar: Navbar;

  map: any;
  marker: any;
  watchId: any; 

  geoLocationOptions = {
    maximumAge: 3000,
    enableHighAccuracy: true
  }; 

  private userid: String;
  private notifications = this.db.list('notification');
 // date: Date = now;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public geolocation: Geolocation,
    private db: AngularFireDatabase,
    public prov: FindMeFirebaseProvider,
    private platform: Platform, 
  ) {  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FindMePage');
    this.userid = this.navParams.get('data');

    this.myCurrPos();
    //this.findMe();
    this.watchMe();
  }

  ionViewWillLeave() {
    console.log('leaving find-me');
    navigator.geolocation.clearWatch(this.watchId);
    this.watchId.subscribe.unsubscribe();
  }

  findMe(){
    this.notifications.push({userid : this.userid, date: new Date().toISOString()});
    FCMPlugin.onNotification(function(data){
      if(data.wasTapped){
        //Notification was received on device tray and tapped by the user.
        alert( JSON.stringify(data) );
      }else{
        //Notification was received in foreground. Maybe the user needs to be notified.
        alert( JSON.stringify(data) );
      }
    });
  }

  myCurrPos() {
    this.geolocation.getCurrentPosition(this.geoLocationOptions).then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, 
                                          position.coords.longitude);
                                                
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
      let content = 'My current position';
      let moveImage = "assets/imgs/person1.png";
      this.marker = new google.maps.Marker({
        map: this.map,
        //title: strCoord,      
        position: latLng,
        icon: moveImage
      });

      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      infoWindow.open(this.map, this.marker);

      this.prov.data.move2Lati = position.coords.latitude + '';
      this.prov.data.move2Long = position.coords.longitude + '';
      this.prov.updatePersonalData();

    });
  }

  watchMe() {
    let watchId = this.geolocation.watchPosition(this.geoLocationOptions);
    let moveImage = "assets/imgs/person1.png";
    watchId.subscribe((pos) => {
      this.marker.setMap(null);
      let updLocation = new google.maps.LatLng(pos.coords.latitude, 
                                               pos.coords.longitude);
      
      //var strCoord = this.addtlInfo (data.coords.latitude.toFixed(4), 
      //                               data.coords.longitude.toFixed(4));
      //var strLati = parseFloat(data.coords.latitude + ' ');
      //var strLong = parseFloat(data.coords.longitude + ' ');
      //var strCoord = 'Name = <b>' + this.myName + '</b> <br/>' + 
      //               'Tel/HP = ' + this.myTelnbr + '<br/>'     +
      //               '(click on icon to call HP) <br/>' + 
      //               'Lat = ' + strLati + ', Long = ' + strLong;

      this.moveMarker(updLocation, moveImage);

      this.prov.data.move2Lati = pos.coords.latitude + '';
      this.prov.data.move2Long = pos.coords.longitude + '';
      this.prov.updatePersonalData();

      console.log('new loc = ', this.prov.data.move2Lati + ', ' + this.prov.data.move2Long);
    });
  }

  moveMarker(newLocation, moveImage) {
    this.marker = new google.maps.Marker({
      map: this.map,
      //title: strCoord,      
      position: newLocation,
      icon: moveImage
    });
    let content = 'My current position';         
    this.addInfoWindow(this.marker, content);  
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
     content: content
   });
 
   infoWindow.open(this.map, marker);
  }
}
