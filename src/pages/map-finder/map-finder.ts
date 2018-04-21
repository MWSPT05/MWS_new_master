import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { GeoProvider } from '../../providers/geo/geo';

//declare Google variable before `@Component`.
declare var google: any;

@IonicPage({
  name: 'map-finder'
})
@Component({
  selector: 'page-map-finder',
  templateUrl: 'map-finder.html',
})
export class MapFinderPage {
  title = "Find Who?";

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public prov: FindMeFirebaseProvider,
    private platform: Platform,
    public geo: GeoProvider
  ) {
    console.log(this.navParams.get('displayName'));
    this.title = 'Finding ' + this.navParams.get('displayName') + '...';
  }

  ionViewDidLoad() {
    let self = this;
    this.platform.ready().then(() => {
      this.initializeMap();
      this.geo.stopTracking();
      this.geo.startTracking(this.loadCurrentLocationSuccess, this);
    });
  };

  initializeMap() {
    let start = new google.maps.LatLng(this.prov.currentLoc.latitude, this.prov.currentLoc.longitude);
    const options = { center: start, zoom: 15 }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  loadCurrentLocationSuccess(self) {
    let deviceId = self.navParams.get('finderId');
    let _self = self;
    self.prov.db.ref('findMe/location/' + deviceId).on('value', resp => {
      let loc = resp.val();
      _self.showDirection(self, resp.val());
    });
  }

  showDirection(_self, loc) {
    let start = new google.maps.LatLng(parseFloat(_self.prov.currentLoc.latitude), parseFloat(_self.prov.currentLoc.longitude));
    let end = new google.maps.LatLng(parseFloat(loc.latitude), parseFloat(loc.longitude));
    
    _self.directionsService.route({
      origin: start,
      destination: end,
      //travelMode: 'DRIVING'
      travelMode: 'TRANSIT'   //public transport
    }, (response, status) => {
      if (status === 'OK') {
        _self.directionsDisplay.setDirections(response);
        _self.directionsDisplay.setMap(_self.map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    //_self.addMarker('Me', start, self.map);
    //_self.addMarker(_self.navParams.get('displayName'), end, _self.map);
  }

  addMarker(title, position, map) {
    return new google.maps.Marker({
      title,
      position,
      map
    });
  }
}
