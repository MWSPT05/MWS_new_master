import { Component } from '@angular/core';
import { IonicPage, AlertController, LoadingController, NavController, Platform, NavParams } from 'ionic-angular';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Profile } from '../../model/profile';

@IonicPage({
  name: 'setting'
})

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  //This is used to set the Ionic Segment to the first segment
  currentMode: string = 'notifyOthers';
  // used to control which segment is displayed
  displayMode: string = this.currentMode;

  loader = null;

  c_items: Array<Profile> = [];
  f_items: Array<Profile> = [];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public nav: NavController,
    public platform: Platform, 
    public prov: FindMeFirebaseProvider) {
  }

  ionViewDidLoad() {
    //Switch to the Current segment
    this.displayMode = this.currentMode;

    //Once the main view loads
    //and after the platform is ready...
    this.platform.ready().then(() => {
      //Setup a resume event listener
      document.addEventListener('resume', () => {
        //Switch to the Current segment
        this.displayMode = this.currentMode;
        this.showNotifyOther();
      });
      //Populate the form with the current location data
      this.showNotifyOther();
    });
  }

  showNotifyOther() {
    //clear out the previous array contents
    this.c_items = [];
    //Create the loading indicator
    this.loader = this.loadingCtrl.create({
      content: "Retrieving people to notify..."
    });
    //Show the loading indicator
    this.loader.present();
    this.prov.loadNotifyOther(this.getNotifyOtherSuccess, this);
  }

  showNotifyMe() {
    //clear out the previous array contents
    this.f_items = [];
    //Create the loading indicator
    this.loader = this.loadingCtrl.create({
      content: "Retrieving people who notify me..."
    });
    //Show the loading indicator
    this.loader.present();
    this.prov.loadNotifyMe(this.getNotifyMeSuccess, this);
  }

  getNotifyOtherSuccess(loadedData, self)
  {
    self.c_items = loadedData;
    if (self.loader !== null) self.loader.dismiss();
  }

  getNotifyMeSuccess(loadedData, self)
  {
    self.f_items = loadedData;
    if (self.loader !== null) self.loader.dismiss();
  }

  refreshPage() {
    //Which page are we looking at now?
    if (this.displayMode === this.currentMode) {
      this.showNotifyOther();
    } else {
      this.showNotifyMe();
    }
  }

  showAlert(message: string) {
    let alert = this.alertController.create({
      title: 'Error',
      subTitle: 'Source: FindMe App Service',
      message: message,
      buttons: [{ text: 'Sorry' }]
    });
    alert.present();
  }

  addRecipient()
  {
    this.navCtrl.push('add-recipient');
  }

  removeRecipient(item: Profile)
  {
      this.prov.deleteNotifyOther(item);
      this.showNotifyOther();
  }

}
