import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
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
  latLng: any;
  marker: any;

  geoLocationOptions = {
    maximumAge: 3000,
    enableHighAccuracy: true
  }

  constructor(
    public zone: NgZone,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public prov: FindMeFirebaseProvider, 
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,    
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
    if (this.prov.profile.homeLatitude != '' && this.prov.profile.homeLongitude != '') {
      this.navCtrl.setRoot(HomePage);
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad HomeLocationPage');
    
    this.geolocation.getCurrentPosition(this.geoLocationOptions).then((pos) => {
      this.latLng = new google.maps.LatLng(pos.coords.latitude.toFixed(6), 
                                           pos.coords.longitude.toFixed(6));
                                                
      let mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.geocoder.geocode({'location': this.latLng}, (results, status) => {
        let markerMsg = 'Current location:<br/>' +
                         results[0].formatted_address
        this.placeMarker(this.latLng, markerMsg)

        //Action Sheet Control
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Please select how you want to enter your address:',
          buttons: [
            {
              text: 'Use current location',
              handler: () => {
                console.log('Use current location');

                // prompt for a name for the address
                let prompt = this.alertCtrl.create({
                //title: 'Login',
                  message: 'Please assign a name for current address : <br/><br/>' +
                          '<b>' + results[0].formatted_address + '</b>',
                  inputs: [
                    {
                      name: 'title',
                      placeholder: 'Assign a name for current address'
                    },
                  ],
                  buttons: [
                    {
                      text: '[ Cancel ]',
                      handler: data => {
                        console.log('Cancel clicked');
                      }
                    },
                    {
                      text: '[ Save ]',
                      handler: data => {
                        //console.log('Saved clicked');
                        let markerMsg = '<b>' + data.title + '</b><br/>' +
                                        results[0].formatted_address + '<br/><br/>' +
                                        '<i>Tap on marker to proceed</i>'
                        this.marker.setMap(null);
                        this.placeMarker(this.latLng, markerMsg);
                        google.maps.event.addListener(this.marker, 'click', () => {
                          this.updHomeDtls(data.title,results[0])
                          //this.navCtrl.pop();
                          this.navCtrl.setRoot(HomePage);
                        });  
                      }
                    }
                  ]
                });
                prompt.present();
              }
            },{
              text: 'Search for an address',
              //icon: 'assets/imgs/googlemaps.png',
              handler: () => {
                console.log('Search Address');
                this.marker.setMap(null);
              }
            },{
              text: 'Go Back',
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        actionSheet.present();
      });
      
    });
  }

  // Put a marker
  placeMarker(markerLatLng, markerMessage) {
    this.marker = new google.maps.Marker({
      position: markerLatLng,
      //title: markerMessage,
      map: this.map
    });        
    let infoWindow = new google.maps.InfoWindow({
      content: markerMessage
    });
    infoWindow.open(this.map, this.marker);  
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
        lat: resp.coords.latitude.toFixed(6),
        lng: resp.coords.longitude.toFixed(6)
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

    this.autocomplete.input = item.description;

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){

        this.marker = new google.maps.Marker({
          position: results[0].geometry.location,
          //title: results[0].formatted_address,
          map: this.map
        });
        this.markers.push(this.marker);
        
        let windowText = '<b>' + item.description + '</b><br/>' + 
                         results[0].formatted_address + '<br/><br/>' +
                         '<i>Tap on marker to proceed</i>'
        let infowindow = new google.maps.InfoWindow({ content: windowText });
        infowindow.open(this.map, this.marker);
        this.map.setCenter(results[0].geometry.location);

        //localStorage.setItem('locName', item.description);
        //localStorage.setItem('locAddr', results[0].formatted_address);
        //localStorage.setItem('fbase_homeLati', results[0].geometry.location.lat());
        //localStorage.setItem('fbase_homeLong', results[0].geometry.location.lng());

        //console.log('fb_lati = ', localStorage.getItem('fbase_homeLati'));
        //console.log('fb_lang = ', localStorage.getItem('fbase_homeLong'));
        //console.log('short name = ', results[0].address_components);

        google.maps.event.addListener(this.marker, 'click', () => {
          this.updHomeDtls(item.description,results[0])
          this.navCtrl.pop();
        });  

      }
    });
  }

  updHomeDtls(homeDesc,srchRslts) {

    this.prov.profile.homeLatitude = srchRslts.geometry.location.lat().toFixed(6);
    this.prov.profile.homeLongitude = srchRslts.geometry.location.lng().toFixed(6);
    this.prov.profile.homeName = homeDesc;
    this.prov.profile.homeAddr = srchRslts.formatted_address;
    this.prov.updatePersonalData();

    //console.log('fb_lati = ', srchRslts.geometry.location.lat().toFixed(6));
    //console.log('fb_lang = ', srchRslts.geometry.location.lng().toFixed(6));
    //console.log('short name = ', srchRslts.address_components);

    localStorage.setItem('locName', homeDesc);
    localStorage.setItem('locAddr', srchRslts.formatted_address);
    localStorage.setItem('fbase_homeLati', srchRslts.geometry.location.lat().toFixed(6));
    localStorage.setItem('fbase_homeLong', srchRslts.geometry.location.lng().toFixed(6));
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

  goBack(){
    this.navCtrl.pop();
  }
}
