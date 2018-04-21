import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FindMeFirebaseProvider } from '../../providers/find-me-firebase/find-me-firebase';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { ToastController } from 'ionic-angular';
import { tap } from 'rxjs/operators';

@Injectable()
export class FcmProvider {

  constructor(
    public http: HttpClient,
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    private prov: FindMeFirebaseProvider,
    public toastCtrl: ToastController) {
  }

  // Get permission from the user
  async getToken() {
    let token: string = 'ckSV-ISRB5w:APA91bF4aEqLnhE3QSeXbCRfT6FFkGaOAaYlkKqimto4CETdHGT2uPIhu8j0XDjPDKV0kjUAQnYD1HntlQZJ_-DNZdLi2DD9RRhTTDxQKik4e2yiBDPpxlIjKNlqPwad7jjZv3EqT_pw';

    try {
      token = await this.firebaseNative.getToken();
      console.log('Retrieve token success: ' + token);

      if (this.platform.is('ios')) {
        this.firebaseNative.grantPermission();
      }

      // Listen to incoming messages
      this.listenToNotifications().pipe(
        tap(msg => {
          let obj: any = msg;
          // show a toast
          console.log(msg)
          const toast = this.toastCtrl.create({
            message: obj.body,
            duration: 3000
          });
          toast.present();
        })
      ).subscribe();
    } catch(error) {
      console.log('platform not ready: ' + error);
    }
    
    console.log('notification token: ' + token);

    //return this.saveTokenToFirestore(token)
    this.prov.data.notificationToken = token;
    return this.prov.updataPersonalData();
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }

  // send notifications
  sendNotifications(token, title, content, deviceId) {
    let body = {
      "notification": {
        "title": title,
        "body": content,
        "sound": "default",
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon"
      },
      "data": {
        "deviceId": deviceId
      },
      "to": token,
      "priority": "high",
      "restricted_package_name": "edu.nus.sg4207.team4.findme"
    }

    let options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post("https://fcm.googleapis.com/fcm/send", body, {
      headers: options.set('Authorization', 'key=AAAAPzUNrU0:APA91bHXqQ1mcOYDRjB6h9EHYwMlbSUMBMORylCEXHKuCbJWmFE9DMiiQr_BwYyzHOBdMW9F03ns0GCEfquNjl09oV4O2-UtcSB9miXcknV7d1GWnkVbeOL593FeCSX9qJ5Qx2Yd3Ek9'),
    }).subscribe();
  }
}
