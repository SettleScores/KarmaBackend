import jwt from 'jsonwebtoken';
import { IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { NextFunction } from 'express';
import EnvVars from '@src/constants/EnvVars';

export const authenticate = (request: IReq, response: IRes, next: NextFunction) => {
  console.log('qqq_authenticateToken_authenticate')

  if (
    request.headers.authorization === undefined ||
    request.headers.authorization === null
  ) {
    response.status(401).json({
      message: "Unauthorized, token does not exist",
    });

    return
  }

  const token: any = request.headers.authorization
  
  let tokenAfterSplit = token.split(" ")[1];

  if (tokenAfterSplit === "") {
    response.status(401).json({
      message: "Token does not exist",
    });
  } else {
    jwt.verify(
      tokenAfterSplit,
      EnvVars.Jwt.Secret,
      (err: any, result: any) => {
        if (err) {
          response.status(401).json({
            message: "Cannot verify JWT token. " + err,
          });
        } else if (result) {
          next()
        } else {
          response.status(401).json({
            message: "Token is invalid or expired",
          });
        }
      }
    );
  }
}