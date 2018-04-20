import { Component, ViewChild, ElementRef } from '@angular/core';
//import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Geolocation } from '@ionic-native/geolocation';
//import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';

import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Profile } from '../../model/profile';

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
    //start = '1.305245, 103.793341'
  end = '1.305245, 103.793341'  //this will be replaced by Elderly Home address
  //end = 'Kent Ridge Guild House'
  //end = 'Fitzrovia'
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(private platform: Platform, public navCtrl: NavController, private geolocation: Geolocation, public global: FindMeFirebaseProvider) {
  }

  ionViewDidLoad(){
    this.platform.ready().then(() =>{
    //console.log(this.mapRef);
      this.showMap();
      this.watchme();
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
