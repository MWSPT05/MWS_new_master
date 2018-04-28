import { Injectable } from '@angular/core';
import * as firebase from 'Firebase';
import { Profile } from '../../model/profile';
import { Recipient } from '../../model/recipient';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';
import { ChildChangeAccumulator } from '@firebase/database/dist/src/core/view/ChildChangeAccumulator';
import { callbackify } from 'util';
import { SigninPage } from '../../pages/signin/signin';


@Injectable()
export class FindMeFirebaseProvider {
//  public deviceId = "";
  private profileList = this.db.list('profile');
  public notifyOther = [];
  public notifyMe = [];
  public notification = [];
  public fb = firebase.database();
  public userExist = 'N';
  
  public profile: Profile = 
  { 
  devToken: '',
  deviceID: '',
  displayName: '',
  homeAddr: '',
  homeLatitude: '',
  homeLongitude: '',
  homeName: '',
  mobileNo: '',
  move2Lati: '',
  move2Long: '',
  isFinding: false
  }; 

  notifyMeNames = [];
  notifyChild: any;
 
  constructor(
    private db: AngularFireDatabase, 
    public alertCtrl: AlertController,
  ){  }

  addProfile(){
    //console.log('add profile');
    let key = this.profileList.push(this.profile).key;
    localStorage.setItem("userKey", key);
    //console.log('key = ', key);
    //this.profileList.push(this.profile);
  }  
    
    
  /*   register(callback, caller) {
    if (this.deviceId != "") {
      firebase.database().ref('profile').child(this.deviceId).once('value').then((resp) => {
        if (resp.exists()) {
          this.data = resp.val();
          callback(resp.val(), caller);
        }
        else {
          this.updatePersonalData();
          callback(this.data, caller);
        }
        // Store to local storage
        localStorage.setItem('fbase_deviceId', this.deviceId);
        localStorage.setItem('fbase_displayName', this.data.displayName);
        localStorage.setItem('fbase_mobileNo', this.data.mobileNo);
        localStorage.setItem('fbase_homeLatitude', this.data.homeLatitude);
        localStorage.setItem('fbase_homeLongitude', this.data.homeLongitude);  
      });
    }
  } */

  updatePersonalData(){
    firebase.database().ref('profile').orderByChild('displayName').equalTo(this.profile.displayName)
      .once("value", snapshot => {
          snapshot.forEach(itemSnap => {
          firebase.database().ref('profile/' + itemSnap.key).set(this.profile);
          return false;
        });
    });
  // firebase.database().ref('profile').child(this.deviceId).set(this.data);
  }

 /* updateMobileNo(prevMobileNo: string) {
    if (this.data.mobileNo != prevMobileNo) {
      firebase.database().ref('mobile/' + this.data.mobileNo + '/' + this.deviceId).set('Registered');
      firebase.database().ref('mobile/' + prevMobileNo + '/' + this.deviceId).set(null);
    }
  }*/

 private findDeleteFirebase(path: string, findBy: string, findValue: string)
  {
    firebase.database().ref(path).orderByChild(findBy).equalTo(findValue).once("value", snapshot => {
      snapshot.forEach(itemSnap => {
        //console.log(path + '/' + itemSnap.key);
        firebase.database().ref(path + '/' + itemSnap.key).set(null);
        return false;
      });
    });
  }

  deleteNotifyOther(recipient: Recipient) {
   // if (this.data.mobileNo === '' || recipient.mobileNo === '') return;
    // Remove notify-other link
    this.findDeleteFirebase('notify-other/' + this.profile.displayName, 'displayName', recipient.displayName);
        // Remove notify-me link from recipient
    this.findDeleteFirebase('notify-me/' + recipient.displayName, 'displayName', this.profile.displayName);
  }

  loadNotifyOther(callback, caller) {
    firebase.database().ref('notify-other/' + this.profile.displayName)
      .on('value', resp => {
        this.notifyOther = [];

        resp.forEach(itemSnap => {
          this.notifyOther.push(itemSnap.val());
          return false;
        });

        callback(this.notifyOther, caller);
      }
      );
  }

  loadNotifyMe(callback, caller) {
    firebase.database().ref('notify-me/' + this.profile.displayName)
      .on('value', resp => {
        this.notifyMe = [];

        resp.forEach(itemSnap => {
          this.notifyMe.push(itemSnap.val());
          return false;
        });
        //this.notifyMe = snapshotToArray(resp);
        callback(this.notifyMe, caller);
      }
      )
  }

  addRecipient(recipient: Recipient) {
    firebase.database().ref('/profile/').orderByChild('displayName').equalTo(recipient.displayName)
     //.on('value', function(snapshot)  {
     .on('value', (snapshot) =>  {       
      var childData;
      var childKey;
      snapshot.forEach((child) => {
        childData = child.val();
        childKey = child.key;
        return false;
      });
      if ((childData == null) || (childData.mobileNo != recipient.mobileNo)){
        let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Recipient not found',
        buttons: ['Dismiss']
      });
      alert.present();
      } else {
        recipient.devToken = childData.devToken;
        let userKey = localStorage.getItem("userKey");
        firebase.database().ref('notify-other/' + this.profile.displayName + '/').push(recipient);
        firebase.database().ref('notify-me/' + recipient.displayName + '/').push({key: userKey, displayName: this.profile.displayName, 
        mobileNo: this.profile.mobileNo});
      }
  });
 
  }

  async chkIfUserExist(userName, userTel) {
    var childData;
    childData = this.profile;
    this.userExist = "N";
    await (
      firebase.database().ref('/profile/').orderByChild('displayName').equalTo(userName).once('value').then((snapshot) => {
        snapshot.forEach((child) => {
          childData = child.val();
          this.profile = childData;
          if (this.profile.mobileNo == userTel) {
            this.userExist = "Y"
            localStorage.setItem("userKey", child.key);
          } else {
            this.profile.mobileNo = userTel;
            this.userExist = "N"
          }
        })
      })
    )
  }

  loadNotifications(arr) {
    var itemData;
    firebase.database().ref('/notify-me/' + this.profile.displayName).once('value').then((snapshot1) => {
      snapshot1.forEach((child) => {
        itemData = child.val();
        //console.log ('itemData.displayName = ', itemData.displayName);
        //console.log ('itemData.mobileNo    = ', itemData.mobileNo);
        //console.log ('itemData.key         = ', itemData.key);
        arr.push({key: itemData.key, displayName: itemData.displayName, mobileNo: itemData.mobileNo});
      });
    });
  }


  addNotification() {        
    firebase.database().ref('notification/').push({displayName : this.profile.displayName, date: new Date().toISOString()});
  }

 }

  
/*export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(item => {
    item.forEach(child => {
      var itemVal = child.val();
      itemVal.key = child.key;

      console.log(itemVal);
      returnArr.push(itemVal);
    })
  });

  return returnArr;

};*/
