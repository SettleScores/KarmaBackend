import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';

export const generateTokenFromUserId = (userId: number) => jwt.sign({ id: userId }, EnvVars.Jwt.Secret, {
          algorithm: "HS256",
          allowInsecureKeySizes: true,
          expiresIn: 86400, // 24 hours
        });