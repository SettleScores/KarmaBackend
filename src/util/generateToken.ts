import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';

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
    /// TODO normal err
  }

  return generateTokenFromUserId(decoded.id, 0)
};        