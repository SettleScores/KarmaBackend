import EnvVars from "@src/constants/EnvVars";
import { IRes } from "@src/routes/types/express/misc";
import { IAuthReq } from "@src/routes/types/types";
import { getMessaging } from "firebase-admin/messaging";
import { PushToken } from '@src/db/models/PushToken';
import jwt from 'jsonwebtoken';
import { extractToken } from '@src/util/generateToken';

export const pushTheTempo = async (request: IAuthReq, response: IRes) => {
  console.log('qqq Private key path: ' + EnvVars.Firebase.PrivateKeyPath);

  const { requestAny, tokenAfterSplit } = extractToken(request);

  const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id

  const pushToken = await PushToken.findOne({
    where: {
      userId: userId,
    },
  }) as any;  

  const devicePushToken = pushToken.dataValues.token

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
    const { requestAny, tokenAfterSplit } = extractToken(request);

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
  console.log('pushTheTempoForAll');

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