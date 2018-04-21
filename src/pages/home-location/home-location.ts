import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { HomePage } from '../home/home';

/**
 * Generated class for the HomeLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-home-location',
  templateUrl: 'home-location.html'
})
export class HomeLocationPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any; 

  constructor(
    public zone: NgZone,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public prov: FindMeFirebaseProvider, 
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);    
  }

  ionViewWillLeave() {
    if (this.prov.data.homeLatitude != '' && this.prov.data.homeLongitude != '') {
      this.navCtrl.setRoot(HomePage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeLocationPage');
    let geoLocationOptions = {
      maximumAge: 3000,
      enableHighAccuracy: true
    }
    
    this.geolocation.getCurrentPosition(geoLocationOptions).then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude.toFixed(4), 
                                          position.coords.longitude.toFixed(4));
                                                
      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }

  tryGeolocation(){
    //this.loading.present();
    this.clearMarkers();//remove previous markers

    this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'I am here!'
      });
      this.markers.push(marker);
      this.map.setCenter(pos);
      //this.loading.dismiss();

    }).catch((error) => {
      console.log('Error getting location', error);
      //this.loading.dismiss();
    });
  }

  selectSearchResult(item){
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        localStorage.setItem('fbase_homeLati', results[0].geometry.location.lat().toFixed(6));
        localStorage.setItem('fbase_homeLong', results[0].geometry.location.lng().toFixed(6));

        this.prov.data.homeLatitude = localStorage.getItem('fbase_homeLati');
        this.prov.data.homeLongitude = localStorage.getItem('fbase_homeLong');
        this.prov.data.homeName = item.description;
        this.prov.data.homeAddr = results[0].formatted_address;
        this.prov.updatePersonalData();

        console.log('fb_lati = ', localStorage.getItem('fbase_homeLati'));
        console.log('fb_lang = ', localStorage.getItem('fbase_homeLong'));

        console.log('short name = ', results[0].address_components);

        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          title: results[0].formatted_address,
          map: this.map
        });

        let windowText = '<b>' + item.description + '</b><br/>' + 
                         results[0].formatted_address      
        let infowindow = new google.maps.InfoWindow({
          content: windowText
        });

        this.markers.push(marker);
        this.map.setCenter(results[0].geometry.location);

        infowindow.open(this.map, marker);

        localStorage.setItem('locName', item.description);
        localStorage.setItem('locAddr', results[0].formatted_address);
      }
    });
  }

  clearMarkers(){
    console.log('markers = ', this.markers);
    if (Array.isArray(this.markers) && this.markers.length) {
      for (var i = 0; i < this.markers.length; i++) {
        console.log(this.markers[i])
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  }
}
