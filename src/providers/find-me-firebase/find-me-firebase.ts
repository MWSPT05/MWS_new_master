import { Injectable } from '@angular/core';
import * as firebase from 'Firebase';
import { Profile, Location, RecipientProfile } from '../../model/profile';

@Injectable()
export class FindMeFirebaseProvider {
  public deviceId = "";
  public data: Profile = { displayName: "", mobileNo: "", homeLatitude: "", homeLongitude: "", notificationToken: "", isFinding: false };
  public notifyOther = [];
  public notifyMe = [];
  public notification = [];
  public db = firebase.database();
  public currentLoc: Location;

  constructor() {
  }

  register(callback, caller) {
    if (this.deviceId != "") {

      this.db.ref('findMe/profile').child(this.deviceId).once('value').then((resp) => {
        if (resp.exists()) {
          this.data = resp.val();
        } else {
          this.updataPersonalData();
        }

        callback(this.data, caller);
      });
    }
  }

  updataPersonalData() {
    this.db.ref('findMe/profile').child(this.deviceId).set(this.data);
  }

  updataCurrentLocation() {
    this.db.ref('findMe/location').child(this.deviceId).set(this.currentLoc);
  }

  updateMobileNo(prevMobileNo: string) {
    console.log('prev: ' + prevMobileNo + ', current: ' + this.data.mobileNo);
    if (this.data.mobileNo != prevMobileNo) {
      this.db.ref('findMe/mobile/' + this.data.mobileNo + '/' + this.deviceId).set('Registered');
      if (prevMobileNo !== '') {
        this.db.ref('findMe/mobile/' + prevMobileNo + '/' + this.deviceId).set(null);
      }
    }
  }

  private findDeleteFirebase(path: string, findBy: string, findValue: string) {
    this.db.ref(path).orderByChild(findBy).equalTo(findValue).once("value", snapshot => {
      snapshot.forEach(itemSnap => {
        this.db.ref(path + '/' + itemSnap.key).set(null);
        return false;
      });
    });
  }

  deleteNotifyOther(recipient: Profile) {
    if (this.data.mobileNo === '' || recipient.mobileNo === '') return;
    // Remove notify-other link
    this.findDeleteFirebase('findMe/notify-other/mobile/' + this.data.mobileNo + '/' + this.deviceId
      , 'mobileNo', recipient.mobileNo);
    // Remove notify-me link from recipient
    this.findDeleteFirebase('findMe/notify-me/mobile/' + recipient.mobileNo
      , 'mobileNo', this.data.mobileNo);
  }

  deleteNotification(notificationId)
  {
    this.db.ref('findMe/notification/' + this.deviceId + '/' + notificationId).set(null);
  }

  private loadData(callback, caller, path, arr) {
    this.db.ref(path).on('value', resp => {
      arr = [];
      resp.forEach(itemSnap => {
        arr.push(itemSnap.val());
        return false;
      });
      callback(arr, caller);
    });
  }

  loadNotifyOther(callback, caller) {
    this.loadData(callback, caller, 'findMe/notify-other/mobile/' + this.data.mobileNo + '/'
      + this.deviceId, this.notifyOther);
  }

  loadNotifyMe(callback, caller) {
    this.loadData(callback, caller, 'findMe/notify-me/mobile/' + this.data.mobileNo, this.notifyMe);
  }

  private findAddRecipient(path: string, findBy: string, person: RecipientProfile) {
    const recipient: RecipientProfile = { displayName: person.displayName, mobileNo: person.mobileNo };
    console.log(recipient);
    this.db.ref(path).orderByChild(findBy).equalTo(recipient.mobileNo).once("value", snapshot => {
      const profile = snapshot.val();
      if (!profile) this.db.ref(path).push(recipient);
    });
  }

  addRecipient(recipient: RecipientProfile) {
    this.findAddRecipient('findMe/notify-other/mobile/' + this.data.mobileNo + '/' + this.deviceId, 'mobileNo', recipient);
    this.findAddRecipient('findMe/notify-me/mobile/' + recipient.mobileNo, 'mobileNo', this.data);
  }

  addNotifications(call, caller) {
    let _this = this;
    // First load from notify-other into an array, then update firebase, send notification
    _this.db.ref('findMe/notify-other/mobile/' + _this.data.mobileNo).child(_this.deviceId)
      .once('value').then(function (resp) {
        let validNotify = [];
        resp.forEach(itemSnap => {
          let p: Profile = itemSnap.val();
          validNotify.push(p);
          return false;
        });
        return validNotify;
      }).then(function (resp2) {
        resp2.forEach(itemSnap2 => {
          _this.db.ref('findMe/mobile').child(itemSnap2.mobileNo).once('value').then(function (resp3) {
            resp3.forEach(function(item) {
              //console.log('deviceId: ' + item.key + ', mobileNo: ' + itemSnap2.mobileNo);
              _this.db.ref('findMe/notification/' + item.key + '/' + _this.deviceId).set('Registered');
              _this.db.ref('findMe/profile').child(item.key).once('value').then(resp4 => {
                if (resp4.exists()) {
                  //console.log(item.key + ': ' + resp4.val().notificationToken);
                  call({deviceId: item.key, token: resp4.val().notificationToken}, caller);
                }
              });
            });
          });
        });
      });
  }

  loadNotifications(arr) {
    let _this = this;
    _this.db.ref('findMe/notification/' + _this.deviceId).on('value', resp => {
      for (let v in resp.val())
      {
        _this.db.ref('findMe/profile').child(v).once('value').then((resp2) => {
          if (resp2.exists()) {
            arr.push({key: v, displayName: resp2.val().displayName, mobileNo: resp2.val().mobileNo });
          }
        });
      }
    });
  }
}

export const snapshotToArray = snapshot => {
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

};
