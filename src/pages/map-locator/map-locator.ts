import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Geolocation } from '@ionic-native/geolocation';

//declare Google variable before `@Component`.
declare var google: any;

@IonicPage({
  name: 'map-locator'
})

@Component({
  selector: 'page-map-locator',
  templateUrl: 'map-locator.html',
})
export class MapLocatorPage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  myLocation: any;
  //start = '1.305245, 103.793341'
  //end = '1.305245, 103.793341'  //this will be replaced by Elderly Home address
  //end = 'Kent Ridge Guild House'
  //end = 'Fitzrovia'
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public prov: FindMeFirebaseProvider,
    private geolocation: Geolocation,
    private platform: Platform) {
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.showMap();
    });
  };

  showMap(){
    this.geolocation.getCurrentPosition().then(pos => {
      this.myLocation = pos;
      // debug
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      let location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      //const location = new google.maps.LatLng(51.507351, -0.127758);
      const options = {
        center: location,
        zoom: 15
      }
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      //this.addMarker('You Are Here', location, this.map);
      this.calculateAndDisplayRoute(location);
    });
   
    //this.addMarker(location, this.map);
  } // showmap()

  calculateAndDisplayRoute(start) {
    let end: string =  this.prov.data.homeLatitude + ", " + this.prov.data.homeLongitude;
    console.log(end);

    this.directionsService.route({
      origin: start,
      destination: end,
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
  }

  addMarker(title, position, map){
    return new google.maps.Marker({
      title,
      position,
      map
    });
  }
}
