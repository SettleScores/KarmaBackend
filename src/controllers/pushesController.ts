import EnvVars from "@src/constants/EnvVars";
import { IRes } from "@src/routes/types/express/misc";
import { IAuthReq } from "@src/routes/types/types";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase-admin/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging } from "firebase-admin/messaging";
import { PushToken } from '@src/db/models/PushToken';
import jwt from 'jsonwebtoken';
var admin = require("firebase-admin");

var serviceAccount = require(EnvVars.Firebase.PrivateKeyPath);

export const pushTheTempo = (request: IAuthReq, response: IRes) => {
  console.log('qqq Private key path: ' + EnvVars.Firebase.PrivateKeyPath);

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAr7nGOCR0MVffORx_WS6T7ypNf0qFJO7U",
//   authDomain: "karma-18c4c.firebaseapp.com",
//   projectId: "karma-18c4c",
//   storageBucket: "karma-18c4c.firebasestorage.app",
//   messagingSenderId: "352593909346",
//   appId: "1:352593909346:web:aa620e397125f292cba33b"
// };

// Initialize Firebase
///const app = initializeApp(firebaseConfig);

  // This registration token comes from the client FCM SDKs.
  ///const registrationToken = "cg6dGx36TNG_f2zE8-LbsX:APA91bHYCNlRu5P_jEKf1MUyvhoWZnRD8GMa4QWlNXdz1-UUBdtvIxFtNMMg8_TUiHLEOd6S368PtHAQQg_S6o9wJLNcrJQdXCa8j2BPJJbyuG0DqAeqvLE"; /// This token goes from device, where it is generated via Firebase SDK
  const token = request.headers.authorization || '' /// subtle nuance; if undefined or null replace with empty string ''
  
  const tokenAfterSplit = token.split(' ')[1];

  const requestAny = request as any /// TODO it would be fino if it was possible to do without 'any'

  const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id
  
  var devicePushToken: string = '';

  PushToken.findOne({
    where: {
      userId: userId,
    },
  }).then((pushToken) => {
    if (pushToken) {
      devicePushToken = pushToken.dataValues.token

      return;
    }
  });

  /// TODO Parse request for message values -- seems to be done
  /// TODO Pass these values from the UI

  const message = {
    notification: {
      title: requestAny.body.title,
      body: requestAny.body.body,
    },
    token: devicePushToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};

export const pushTheToken = (request: IAuthReq, response: IRes) => {
  console.log('qqq pushTheToken');

  try {
    const token = request.headers.authorization || '' /// subtle nuance; if undefined or null replace with empty string ''
  
    const tokenAfterSplit = token.split(' ')[1];

    const requestAny = request as any /// TODO it would be fino if it was possible to do without 'any'

    const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id

    PushToken.destroy({ where: { userId: userId } });

    PushToken.create({
      userId: userId,
      token: requestAny.body.token,
    });

    response.status(200).json({ success: 'push token stored successful' });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

/// TODO Parse request for message values

/// TODO notification title: requestAny.body.title
/// TODO notification body: requestAny.body.body
export const pushTheTempoForAll = (request: IAuthReq, response: IRes) => {
  const messaging = getMessaging()

  PushToken.findAll().then((pushTokens) => {
    pushTokens.forEach((pushToken) => {
      console.log("pushTheTempoForAll pushToken: ", pushToken);

      const message = {
        notification: {
          title: "KarmaApp",
          body: "Do you want to cpmplete some task?!",
        },
        token: pushToken.dataValues.token,
      };

      messaging
        .send(message)
        .then((response) => {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    });
  });

  

  // Send a message to the device corresponding to the provided
  // registration token.
  
};