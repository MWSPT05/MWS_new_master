const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
 
admin.initializeApp(functions.config().firebase);
var watchnotify;
exports.Pushtrigger = functions.database.ref('/notification/{messageId}').onWrite((change,context) => {
    watchnotify = change.after.val();
 
    admin.database().ref('/user').orderByChild('userid').once('value').then((alltokens) => {
        var rawtokens = alltokens.val();
        var tokens = [];
             var processedtokens = []
            for (var token in rawtokens) {
                processedtokens.push(rawtokens[token]);
            }
            for (var token of processedtokens) {
                tokens.push(token.devtoken);
            }
        
        var payload = {
            
                "notification":{
                    "title":"SOS App",
                    "body":"Find Me!",
                    "sound":"default",
                    },
                "data":{
                    From: watchnotify.userid,
                    "message":"Find Me!"
                } 
        }      
        return admin.messaging().sendToDevice(tokens, payload).then((response) => {
            console.log(tokens);
        }).catch((err) => {
            console.log(err);
         })
        })    
    })

 
