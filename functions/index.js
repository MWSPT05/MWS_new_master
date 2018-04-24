const functions = require('firebase-functions');
const admin = require('firebase-admin');
 
admin.initializeApp(functions.config().firebase);
var watchnotify;
exports.Pushtrigger = functions.database.ref('/notification/{messageId}').onWrite((change,context) => {
    watchnotify = change.after.val();
 
    admin.database().ref('/notify-other/' + watchnotify.displayName + '/').orderByChild('displayName').once('value').then((alltokens) => {
        var rawtokens = alltokens.val();
        var tokens = [];
        var processedtokens = []
            for (var token in rawtokens) {
                processedtokens.push(rawtokens[token]);
            }
            for (token of processedtokens) {
                tokens.push(token.devToken);
            }
        
        var payload = {
            
                "notification":{
                    "title":"FindMe",
                    "body":"Requesting to find " + watchnotify.displayName,
                    "sound":"default",
                    "click_action": "FCM_PLUGIN_ACTIVITY",
                    "icon": "fcm_push_icon"
                    },
                "data":{
                    "title": "Find Me!",
                    "message":"Requesting to find " + watchnotify.displayName
                } 
        }      
        return admin.messaging().sendToDevice(tokens, payload).then((response) => {
            console.log(tokens)
            return null;
        }).catch((err) => {
            console.log(err);
          
         });
       }).catch((err) => {
            console.log(err)
        });    
    })


 
