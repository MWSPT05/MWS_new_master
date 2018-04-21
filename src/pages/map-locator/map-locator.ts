import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { GeoProvider } from '../../providers/geo/geo';

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
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  end: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public prov: FindMeFirebaseProvider,
    private platform: Platform,
    public geo: GeoProvider
  ) { }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.initializeMap();
      this.geo.stopTracking();
      this.geo.startTracking(this.bringMeHome, this);
      //this.bringMeHome(this);
      //this.geo.getCurrentLocation(true, this.bringMeHome, this);
    });
  };

  initializeMap()
  {
    let start = new google.maps.LatLng(this.prov.currentLoc.latitude, this.prov.currentLoc.longitude);
    this.end = new google.maps.LatLng(parseFloat(this.prov.data.homeLatitude), parseFloat(this.prov.data.homeLongitude));
    const options = { center: start, zoom: 15 }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  bringMeHome(self) {
    console.log(self.prov.currentLoc);
    let start = new google.maps.LatLng(self.prov.currentLoc.latitude, self.prov.currentLoc.longitude);

    self.directionsService.route({
      origin: start,
      destination: self.end,
      //travelMode: 'DRIVING'
      travelMode: 'TRANSIT'   //public transport
    }, (response, status) => {
      if (status === 'OK') {
        self.directionsDisplay.setDirections(response);
        self.directionsDisplay.setMap(self.map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    //self.addMarker('Me', start, self.map);
    //self.addMarker('Home', end, self.map);
  }

  addMarker(title, position, map) {
    return new google.maps.Marker({
      title,
      position,
      map
    });
  }
}
