import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { CallNumber } from '@ionic-native/call-number';
import * as firebase from 'Firebase';
//import delay, { delayReject, delayThen, delayCatch } from 'delay.ts';

// custom imports
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Profile } from '../../model/profile';
import { isEmpty } from '@firebase/util';

/**
 * Generated class for the MapFinderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google: any;

@IonicPage({ name: 'map-finder'})

@Component({
  selector: 'page-map-finder',
  templateUrl: 'map-finder.html',
})
export class MapFinderPage {

  @ViewChild('map') mapElement: ElementRef;
  title = 'Map Finder';

  public profile: Profile = 
  { 
    devToken: "",
    deviceID: "",
    displayName: "", 
    homeAddr: "", 
    homeLatitude: "", 
    homeLongitude: "",
    homeName: "",
    mobileNo: "",
    move2Lati: "",
    move2Long: "",
    isFinding: false,
    //isActive: false
  };

  map: any;
  latLng: any;
  marker: any;
  myLoc: any;
  userLoc: any;
  userName: any;
  myTelNbr: any;
  watchId: any;
  latcoord: any;
  lngcoord: any;
  msgText: any;
  profKey: any;

  markerUser: any = [];
  markerRecipient: any = [];
  markerIdx1: number = 0;
  markerIdx2: number = 0;

  loadFlag: any;
  
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true});

  geoLocationOptions = {
    maximumAge: 3000,
    enableHighAccuracy: true
  }

  public db = firebase.database();

  constructor(
    public prov: FindMeFirebaseProvider,
    public geolocation: Geolocation,
    public callNumber: CallNumber,
    public alertCtrl: AlertController,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapFinderPage');

    this.userName = this.navParams.get('displayName');
    this.profKey = this.navParams.get('finderId');
    //console.log('userName = ', this.userName);
    //console.log('profKey = ', this.profKey);

    this.showMap();
    this.watchUs();
  }

  ionViewWillLeave() {
    this.watchId.unsubscribe();
    //watchId.unsubscribe();
  }

  showMap() {
    console.log('showMap');
    this.geolocation.getCurrentPosition(this.geoLocationOptions).then((pos) => {
      this.myLoc = new google.maps.LatLng(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6));
      
      let mapOptions = {
        center: this.myLoc,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    });
  }

  watchUs() {
    let currImage = "assets/imgs/person1.png";

    this.loadFlag = 'Y';
    this.watchId = this.geolocation.watchPosition().subscribe((data) => {
      this.myLoc = new google.maps.LatLng(data.coords.latitude.toFixed(6), data.coords.longitude.toFixed(6));
      //console.log('my loc = ', this.myLoc.lat() + ' ' + this.myLoc.lng());
      this.clearMarker2();
      this.moveMarker(this.myLoc, currImage, 'My current position', 'N', 'R');
      this.loadUserLocation(this.loadFlag);
      this.calculateAndDisplayRoute();
      //this.loadUserLocation();
    });
    //this.loadUserLocation(this.loadFlag);
  }

  moveMarker(newLocation, moveImage, strCoord, callFlag, markerId){
    //if (this.marker != null) { this.marker.setMap(null) };
    this.marker = new google.maps.Marker({
      map: this.map,
      position: newLocation,
      icon: moveImage
    });

    if (markerId == 'U') {
      this.markerUser[this.markerIdx1] = this.marker;
      this.markerIdx1++;
      console.log('markerIdx1 = ', this.markerIdx1);
    }
    if (markerId == 'R') {
      this.markerRecipient[this.markerIdx2] = this.marker;
      this.markerIdx2++;
      console.log('markerIdx2 = ', this.markerIdx2);
    }

    console.log('new loc = ', newLocation.lat() + ' ' + newLocation.lng());
    if (newLocation.lat() == 0 && newLocation.lng() == 0) {
      this.navCtrl.pop();
    }
    let content = strCoord;
    //let allowCall = 'N';
    this.addInfoWindow(this.marker, content, callFlag);
  }

  addInfoWindow(marker, content, allowCall){
    //let myTelnbr = this.prov.data.mobileNo;

    if (allowCall == 'Y') {
      this.msgText = '<b>User = ' + this.userName + "</b><br/>" +
                     this.myTelNbr;
    } else {
      this.msgText = content; 
    }

    let infoWindow = new google.maps.InfoWindow({
      content: this.msgText
    });
    infoWindow.open(this.map, marker);
      
    if (allowCall = 'Y') {
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
        this.callNumber.callNumber(this.myTelNbr, true)
          .then(res => console.log('Dialling = ', this.myTelNbr))
          .catch(err => console.log('Error launching dialer', err));
      });
    }
  }

  loadUserLocation(loadFlag) {
    console.log('loadMyRecord = ', loadFlag);
    let userImage = "assets/imgs/person3.png";
    let fbKey = '/profile/' + this.profKey + '/';
    console.log('fbKey = ', fbKey);

    this.db.ref(fbKey).once('value').then((fbData) => {
      console.log('here 1');
      this.profile = fbData.val();
      console.log('fbData.val = ', fbData.val());
      if (this.profile.isFinding == false) {
        console.log('here 2');
        let alert = this.alertCtrl.create({
          title: 'No active FindMe! request',
          subTitle: 'Your friend has not requested to be found!',
          buttons: ['OK']
        });
        alert.present();
        this.navCtrl.pop();
      } else {
        console.log('here 3');
        this.latcoord = this.profile.move2Lati;
        this.lngcoord = this.profile.move2Long;
        this.userName = this.profile.displayName;
        this.myTelNbr = this.profile.mobileNo;
        this.userLoc = new google.maps.LatLng(this.latcoord, this.lngcoord);
        this.clearMarker1();
        this.moveMarker(this.userLoc, userImage, 'User position', 'Y', 'U');
        this.calculateAndDisplayRoute();
      }
    });
    console.log('here 4');
    if(loadFlag == 'Y') {
      this.db.ref(fbKey).on('value', resp1 => {
        console.log('here 5');
        this.db.ref(fbKey + '/move2Lati').once('value').then((resp2) => {
          console.log('here 6');
          console.log('User Location has changed');
          this.latcoord = resp2.val();
          //console.log('resp2.val() = ', resp2.val() + ' ' + this.latcoord);
      
          this.db.ref(fbKey + '/move2Long').once('value').then((resp3) => {
            console.log('here 7');
            this.lngcoord = resp3.val();
            this.userLoc = new google.maps.LatLng(this.latcoord, this.lngcoord);
            this.clearMarker1();
            this.moveMarker(this.userLoc, userImage, 'User position', 'Y', 'U');
            this.calculateAndDisplayRoute();    
            //console.log('resp3.val() = ', resp3.val() + ' ' + this.lngcoord);
          });
        });
      });
      this.loadFlag = 'N';
    }
  }

  calculateAndDisplayRoute() {
    //console.log('Loc1 = ', this.myLoc.lat() + ' ' + this.myLoc.lng());
    //console.log('Loc2 = ', this.userLoc.lat() + ' ' + this.userLoc.lng());

    this.directionsService.route({
      origin: this.myLoc,
      destination: this.userLoc,
      //travelMode: 'WALKING'   //public transport
      travelMode: 'TRANSIT'   //public transport
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        this.directionsDisplay.setMap(this.map);
      } else {
        //delay(1 * 1000);
        //window.alert('Directions request failed due to ' + status);
        //function sleep(milliseconds) {
        //  let milliseconds = 1000;
        //  console.log('Error, sleep for ', milliseconds);
        //  var curTime = new Date().getTime();
        //  for (var i = 0; i < 1e7; i++) {
        //    if ((new Date().getTime() - curTime) > milliseconds){
        //      break;
        //    }
        //  }
        //}
      }
    });
  } //calculateAndDisplayRoute()

  clearMarker1(){
    console.log('marker1 = ', this.markerUser);
    if (Array.isArray(this.markerUser) && this.markerUser.length) {
      for (var i = 0; i < this.markerUser.length; i++) {
        console.log(i, 'i = ' + this.markerUser[i])
        this.markerUser[i].setMap(null);
      }
    }
    this.markerUser = [];
    this.markerIdx1 = 0;
  }

  clearMarker2(){
    console.log('marker2 = ', this.markerRecipient);
    if (Array.isArray(this.markerRecipient) && this.markerRecipient.length) {
      for (var i = 0; i < this.markerRecipient.length; i++) {
        console.log(i, 'i = ' + this.markerRecipient[i])
        this.markerRecipient[i].setMap(null);
      }
    }
    this.markerRecipient = [];
    this.markerIdx2 = 0;
  }

  callUser() {
    console.log('Dial number = ', this.myTelNbr);
    this.callNumber.callNumber(this.myTelNbr, true)
    .then(res => console.log('Dialling = ', this.myTelNbr))
    .catch(err => console.log('Error launching dialer', err));
  }


}
