import { User } from '@src/db/models/User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Role } from '@src/db/models/Role';
import { IReq } from '@src/routes/types/types';
import { SignUpRequest } from '@src/middleware/verifySignUp';
import { IRes } from '@src/routes/types/express/misc';

export const createUser = (request: IReq<SignUpRequest>, response: IRes) => {
  const generatedPassword = bcrypt.hashSync(request.body.password, 8);

  return User.create({
    fullName: request.body.fullName,
    email: request.body.email,
    gender: request.body.gender,
    username: request.body.username,
    password: generatedPassword,
  })
    .then(user => {
        user.setRoles([1]).then(() => {
          response.send({ message: 'User was registered successfully!' });
        });
      }
  )
    .catch((err: Error) => {
      response.status(500).json({ message: err.message });
    });
};
