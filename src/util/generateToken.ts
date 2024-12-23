import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';
import { IAuthReq } from '@src/routes/types/types';

export const generateTokenFromUserId = (userId: number, expIn: number = 86400) =>
  jwt.sign({ id: userId }, EnvVars.Jwt.Secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: expIn, /// 24 hours or 0 hours [for Logout]
  });

export const generateLogoutTokenFromToken = (accessToken: string) => {
  let decoded: any;

  try {
    decoded = jwt.verify(accessToken, EnvVars.Jwt.Secret);
  } catch(err) {
    /// err TODO normal err
  }

  return generateTokenFromUserId(decoded.id, 0)
};

export const extractToken = (request: IAuthReq) => {
  const token = request.headers.authorization || ''; /// subtle nuance; if undefined or null replace with empty string ''

  const tokenAfterSplit = token.split(' ')[1];

  const requestAny = request as any; /// TODO it would be fino if it was possible to do without 'any'
  
  return { requestAny, tokenAfterSplit };
}