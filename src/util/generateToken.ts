import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';
import { JwtPayload } from 'jsonwebtoken';

export const generateTokenFromUserId = (userId: number) =>
  jwt.sign({ id: userId }, EnvVars.Jwt.Secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: 86400, // 24 hours
  });

export const generateLogoutTokenFromToken = (accessToken: string) => {
  let decoded: any;

  try {
    decoded = jwt.verify(accessToken, EnvVars.Jwt.Secret);
  } catch(err) {
    /// err TODO normal err
  }

  return jwt.sign({ id: decoded.id }, EnvVars.Jwt.Secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: 0, /// 0 hours
  });
};
          