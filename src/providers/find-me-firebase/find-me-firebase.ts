import { Injectable } from '@angular/core';
import * as firebase from 'Firebase';
import { Profile } from '../../model/profile';

@Injectable()
export class FindMeFirebaseProvider {
  public deviceId = "";
  public data: Profile = { displayName: "", mobileNo: "", homeLatitude: "", homeLongitude: "" };
  public notifyOther = [];
  public notifyMe = [];

  constructor() { }

  register(callback, caller) {
    if (this.deviceId != "") {
      firebase.database().ref('findMe/profile').child(this.deviceId).once('value').then((resp) => {
        if (resp.exists()) {
          this.data = resp.val();
          callback(resp.val(), caller);
        }
        else {
          this.updataPersonalData();
          callback(this.data, caller);
        }
      });
    }
  }

  updataPersonalData() {
    firebase.database().ref('findMe/profile').child(this.deviceId).set(this.data);
  }

  updateMobileNo(prevMobileNo: string) {
    if (this.data.mobileNo != prevMobileNo) {
      firebase.database().ref('findMe/mobile/' + this.data.mobileNo + '/' + this.deviceId).set('Registered');
      firebase.database().ref('findMe/mobile/' + prevMobileNo + '/' + this.deviceId).set(null);
    }
  }

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

  deleteNotifyOther(recipient: Profile) {
    if (this.data.mobileNo === '' || recipient.mobileNo === '') return;
    // Remove notify-other link
    this.findDeleteFirebase('findMe/notify-other/mobile/' + this.data.mobileNo + '/' + this.deviceId
      , 'mobileNo', recipient.mobileNo);
    // Remove notify-me link from recipient
    this.findDeleteFirebase('findMe/notify-me/mobile/' + recipient.mobileNo
      , 'mobileNo', this.data.mobileNo);
  }

  loadNotifyOther(callback, caller) {
    firebase.database().ref('findMe/notify-other/mobile/' + this.data.mobileNo + '/' + this.deviceId)
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
    firebase.database().ref('findMe/notify-me/mobile/' + this.data.mobileNo)
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

  private findAddRecipient(path: string, findBy: string, person: Profile)
  {
    firebase.database().ref(path)
      .orderByChild(findBy).equalTo(person.mobileNo).once("value", snapshot => {
        const profile = snapshot.val();
        if (!profile) firebase.database().ref(path).push(person);
      }
    );
  }

  addRecipient(recipient: Profile) {
    this.findAddRecipient('findMe/notify-other/mobile/' + this.data.mobileNo + '/' + this.deviceId, 'mobileNo', recipient);
    this.findAddRecipient('findMe/notify-me/mobile/' + recipient.mobileNo, 'mobileNo', this.data);
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
