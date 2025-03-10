import EnvVars from '@src/constants/EnvVars';
import { IRes } from '@src/routes/types/express/misc';
import { IAuthReq } from '@src/routes/types/types';
import { getMessaging } from 'firebase-admin/messaging';
import { PushToken } from '@src/db/models/PushToken';
import jwt from 'jsonwebtoken';
import { extractToken } from '@src/util/generateToken';
import logger from 'jet-logger';

export const pushTheTempo = async (request: IAuthReq<{ title: string, body: any }>, response: IRes) => {
  console.log('qqq Private key path: ' + EnvVars.Firebase.PrivateKeyPath);

  const { tokenAfterSplit } = extractToken(request);

  const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id;

  const pushToken = await PushToken.findOne({
    where: {
      userId: userId,
    },
  }) as any;

  const devicePushToken = pushToken.dataValues.token;

  /// TODO Parse request for message values -- seems to be done
  /// TODO Pass these values from the UI

  const message = {
    notification: {
      title: request.body.title,
      body: request.body.body,
    },
    token: devicePushToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      logger.info('Successfully sent message: ' + response);
    })
    .catch((error) => {
      logger.err('Error sending message: ' + error);
    });
};

export const pushTheToken = (request: IAuthReq<{ token: string }>, response: IRes) => {
  console.log('qqq pushTheToken');

  try {
    const { tokenAfterSplit } = extractToken(request);

    const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id;

    PushToken.destroy({ where: { userId: userId } });

    PushToken.create({
      userId: userId,
      token: request.body.token,
    });

    response.status(200).json({ success: 'push token stored successful' });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const pushTheTempoForAll = (request: IAuthReq<{ body: string, title: string }>, response: IRes) => {
  logger.info('pushTheTempoForAll      ___' + JSON.stringify(request.body));

  const notificationText = request.body.body;
  const notificationTitle = request.body.title;

  const messaging = getMessaging();

  PushToken.findAll().then((pushTokens) => {
    pushTokens.forEach((pushToken) => {
      logger.info('pushTheTempoForAll pushToken: ' + pushToken?.dataValues?.token);

      const message = {
        notification: {
          title: notificationTitle,
          body: notificationText,
        },
        token: pushToken.dataValues.token,
      };

      messaging
        .send(message)
        .then((resp) => {
          logger.info('Successfully sent message: ' + resp);
          response.status(200).send();
        })
        .catch((error) => {
          logger.err('Error sending message');
          logger.err(error);
        });
    });
  });
};