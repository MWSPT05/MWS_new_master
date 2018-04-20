import { Component, ViewChild, ElementRef } from '@angular/core';
//import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Geolocation } from '@ionic-native/geolocation';
//import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';

import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';

import { CallNumber } from '@ionic-native/call-number';

//import { WatchMeRtnProvider } from '../../providers/watch-me-rtn/watch-me-rtn';

/**
 * Generated class for the MapviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  //declare Google variable before `@Component`.
declare var google: any;

@IonicPage({
  name: 'map-view'
})

@Component({
  selector: 'page-mapview',
  templateUrl: 'mapview.html',
})
export class MapviewPage {
  site = {
    url : 'COMWorks.com',
    description : 'Training and Consulting Services'
  }

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  myLocation: any;
  marker: any;
<<<<<<< HEAD
  private myName: string;     //localStorage.getItem('fbase_displayName');
  private myTelnbr: string;   //localStorage.getItem('fbase_mobileNo');

  //start = '1.305245, 103.793341'
  //end = '1.305245, 103.793341'  //this will be replaced by Elderly Home address
=======
    //start = '1.305245, 103.793341'
  end = '1.305245, 103.793341'  //this will be replaced by Elderly Home address
>>>>>>> c6a9b5fea55890c8187052c182bb1635858def03
  //end = 'Kent Ridge Guild House'
  //end = 'Fitzrovia'
  end = localStorage.getItem('fbase_homeLatitude') + ', ' + localStorage.getItem('fbase_homeLongitude');
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(private platform: Platform, 
              public navCtrl: NavController, 
              private geolocation: Geolocation, 
              private callNumber: CallNumber,
              public global: FindMeFirebaseProvider) { }

  ionViewDidLoad(){
    this.platform.ready().then(() =>{
    //console.log(this.mapRef);
      this.showMap();
<<<<<<< HEAD
      this.findMe();
      this.watchMe();
=======
      this.watchme();
>>>>>>> c6a9b5fea55890c8187052c182bb1635858def03
    });
  };

  showMap(){
    
    this.geolocation.getCurrentPosition().then(pos => {
      // debug
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
             
      let location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      let curPosImage = "assets/imgs/person1.png";
      this.marker = new google.maps.Marker({
        map: this.map,
        position: location,
        icon: curPosImage
      });
      //const location = new google.maps.LatLng(51.507351, -0.127758);
      const options = {
        center: location,
        zoom: 15
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      //this.addMarker('You Are Here', location, this.map);
      this.calculateAndDisplayRoute(location);
    });
    //const location = new google.maps.LatLng(51.507351, -0.127758);
    //const location = new google.maps.LatLng(pos.coords.latitude, -0.127758);
    /*      const options = {
      center: location,
      zoom: 10
    }        
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    */
    //this.addMarker(location, this.map);
  } // showmap()

  calculateAndDisplayRoute(start) {
    this.end = localStorage.getItem('fbase_homeLati') + ', ' + localStorage.getItem('fbase_homeLong');
    this.directionsService.route({
      origin: start,
      //origin: location,
      destination: this.end,
      //travelMode: 'DRIVING'
      travelMode: 'TRANSIT'   //public transport
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        this.directionsDisplay.setMap(this.map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    console.log('end = ' + this.end);
  } //calculateAndDisplayRoute()
  
  //addMarker(title, position, map){
  //  return new google.maps.Marker({
  //    title,
  //    position,
  //    map
  //  });
  //} //addMarker()

  watchme() {
    let watch = this.geolocation.watchPosition();
    let moveImage = "assets/imgs/person1.png";
    watch.subscribe((data) => {
      this.marker.setMap(null);
      let updLocation = new google.maps.LatLng(data.coords.latitude.toFixed(4), 
                                               data.coords.longitude.toFixed(4));
      
      //var strCoord = this.addtlInfo (data.coords.latitude.toFixed(4), 
      //                               data.coords.longitude.toFixed(4));
      //var strLati = parseFloat(data.coords.latitude + ' ');
      //var strLong = parseFloat(data.coords.longitude + ' ');
      //var strCoord = 'Name = <b>' + this.myName + '</b> <br/>' + 
      //               'Tel/HP = ' + this.myTelnbr + '<br/>'     +
      //               '(click on icon to call HP) <br/>' + 
      //               'Lat = ' + strLati + ', Long = ' + strLong;

      this.moveMarker(updLocation, moveImage);
    });
  }

  moveMarker(newLocation, moveImage) {
    this.marker = new google.maps.Marker({
      map: this.map,
      //title: strCoord,      
      position: newLocation,
      icon: moveImage
    });
<<<<<<< HEAD
  } //addMarker()

  findMe(){
    let geoLocationOptions = {
      maximumAge: 3000,
      enableHighAccuracy: true
    } 

    this.geolocation.getCurrentPosition(geoLocationOptions).then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      //var strCoord = this.addtlInfo (position.coords.latitude, position.coords.longitude);    
      let strCoord = "My current position";
      let curPosImage = "assets/imgs/person2.png";
      this.putMarker(latLng, curPosImage, strCoord);
           
    }).catch((error) => {
      console.log(error);
    });
  }

  putMarker(location, curPosImage, strCoord) {
    this.marker = new google.maps.Marker({
      map: this.map,
      //title: strCoord,
      animation: google.maps.Animation.DROP, 
      position: location,
      icon: curPosImage
    });
   
    let content = strCoord;         
    let allowCall = 'N';
    this.addInfoWindow(this.marker, content, allowCall);  
  }

  watchMe() {
    let watch = this.geolocation.watchPosition();
    let moveImage = "assets/imgs/person2.png";

    watch.subscribe((data) => {
      //this.marker.setMap(null);
      let updLocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      //var strCoord = this.addtlInfo (data.coords.latitude, data.coords.longitude);      
      let strCoord = 'My current position';
      this.moveMarker(updLocation, moveImage, strCoord);
    });
  }

  moveMarker(newLocation, moveImage, strCoord){
    this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      map: this.map,
      //title: strCoord,      
      position: newLocation,
      icon: moveImage
    });

    let content = strCoord;
    let allowCall = 'N';
    this.addInfoWindow(this.marker, content, allowCall);  
  }

  addInfoWindow(marker, content, allowCall){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  
    infoWindow.open(this.map, marker);

    if (allowCall = 'Y') {
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
        this.callNumber.callNumber(this.myTelnbr, true)
          .then(res => console.log('Dialling = ',this.myTelnbr))
          .catch(err => console.log('Error launching dialer', err));
      });
    }
  }
 
  addtlInfo(infoLati, infoLong) {
    var strLati = parseFloat(infoLati + ' ');
    var strLong = parseFloat(infoLong + ' ');
    return 'Name = <b>' + this.myName + '</b> <br/>' + 
           'Tel/HP = ' + this.myTelnbr + '<br/>'     +
           '<i>(click on icon/marker to call) </i> <br/>' + 
           'Lat = ' + strLati + ', Long = ' + strLong;
=======
    let content = 'My current position';         
    this.addInfoWindow(this.marker, content);  
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
     content: content
   });
 
   infoWindow.open(this.map, marker);
>>>>>>> c6a9b5fea55890c8187052c182bb1635858def03
  }
}
