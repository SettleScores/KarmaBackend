import jwt from 'jsonwebtoken';
import { IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { NextFunction } from 'express';
import EnvVars from '@src/constants/EnvVars';
import { User } from '@src/db/models/User';

export const authenticate = (request: IReq, response: IRes, next: NextFunction) => {
  if (
    request.headers.authorization === undefined ||
    request.headers.authorization === null
  ) {
    response.status(401).send();

    return
  }

  const token: any = request.headers.authorization
  
  let tokenAfterSplit = token.split(" ")[1];

  if (tokenAfterSplit === "") {
    response.status(401).json();
  } else {
    jwt.verify(
      tokenAfterSplit,
      EnvVars.Jwt.Secret,
      (err: any, result: any) => {
        if (err) {
          response.status(401).send();
        } else if (result) {
          let decoded: any;  

          try {
            decoded = jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret);
          } catch(err) {
            /// err TODO normal err
          }  

          User.findOne({
            where: { id: decoded.id },
          }).then((user) => {
            if (!user) {
              return response.status(404).send();
            }

            delete user.password;  

            (request as any).user = user;

            next()
          });
        } else {
          response.status(401).send();
        }
      }
    );
  }
}