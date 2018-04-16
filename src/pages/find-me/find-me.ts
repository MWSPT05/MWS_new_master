import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
declare var FCMPlugin;

/**
 * Generated class for the FindMePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'find-me'
})
@Component({
  selector: 'page-find-me',
  templateUrl: 'find-me.html',
})
export class FindMePage {
  private userid: String;
  private notifications = this.db.list('notification');
 // date: Date = now;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindMePage');
    this.userid = this.navParams.get('data')
  }

  findMe(){
  
    this.notifications.push({userid : this.userid, date: new Date().toISOString()});
    FCMPlugin.onNotification(function(data){
      if(data.wasTapped){
        //Notification was received on device tray and tapped by the user.
        alert( JSON.stringify(data) );
      }else{
        //Notification was received in foreground. Maybe the user needs to be notified.
        alert( JSON.stringify(data) );
      }
    });
  }
}
