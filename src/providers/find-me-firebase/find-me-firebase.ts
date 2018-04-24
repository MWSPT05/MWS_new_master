import { Injectable } from '@angular/core';
import * as firebase from 'Firebase';
import { Profile } from '../../model/profile';
import { Recipient } from '../../model/recipient';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertController } from 'ionic-angular';

@Injectable()
export class FindMeFirebaseProvider {
//  public deviceId = "";
  private profileList = this.db.list('profile');
  public notifyOther = [];
  public notifyMe = [];
  public profile: Profile = 
  { 
  displayName: '',
  mobileNo: '',
  devToken: '',
  deviceID: '',
  homeLatitude: '',
  homeLongitude: '',
  homeName: '',
  homeAddr: '',
  move2Lati: '',
  move2Long: ''
  }; 

  constructor(private db: AngularFireDatabase, public alertCtrl: AlertController){}

    addProfile(){
      this.profileList.push(this.profile);
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
//    firebase.database().ref('profile').child(this.deviceId).set(this.data);
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
        console.log(path + '/' + itemSnap.key);
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
    var userName = this.profile.displayName
    var userMobile = this.profile.mobileNo
    firebase.database().ref('/profile/').orderByChild('displayName').equalTo(recipient.displayName)
     .on('value', function(snapshot)  {
         var childData;
         snapshot.forEach(function(child) {
           childData = child.val();
           return false;
         });
   
         if ((childData == null) || (childData.mobileNo != recipient.mobileNo)){
           console.log("recipient not found");
           let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Recipient not found',
            buttons: ['Dismiss']
          });
          alert.present();
         } else {
           recipient.devToken = childData.devToken;
           console.log("recipient found");
           firebase.database().ref('notify-other/' + userName + '/').push(recipient);
          firebase.database().ref('notify-me/' + recipient.displayName + '/').push({displayName: userName, 
          mobileNo: userMobile});
         }
     });
     
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
