import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase} from 'angularfire2/database';
import { User } from '../../model/user';
declare var FCMPlugin;

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private userList = this.db.list('user');
  user: User = {
    userid: '',
    devtoken: '',
  }
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private db: AngularFireDatabase,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    FCMPlugin.onTokenRefresh(function(token){
      alert( token );
  });    
  }
  
  userLogin(user: User) {
    this.tokensetup().then((token) => {
    user.devtoken = <string> token;
//    user.deviceid = this.device.uuid;
    this.userList.push(user);
    this.navCtrl.push('find-me',{data: user.userid});
    })
  }

  tokensetup() {
    var promise = new Promise((resolve, reject) => {
      FCMPlugin.getToken(function(token){
        resolve(token);
      }, (err) => {
        reject(err);
      });
    })
    return promise;
  }

}
  

