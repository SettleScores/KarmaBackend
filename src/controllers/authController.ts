import { User } from '@src/db/models/User';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { Role } from '@src/db/models/Role';
import { IReq } from '@src/routes/types/types';
import { SignUpRequest } from '@src/middleware/verifySignUp';
import { IRes } from '@src/routes/types/express/misc';
import { LogInRequest } from '@src/middleware/verifyLogIn';
import { generateTokenFromUserId } from '@src/util/generateToken';
import { LogOutRequest } from '@src/middleware/verifyLogOut';
import { generateLogoutTokenFromToken } from '@src/util/generateToken';

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
          response.send({ message: 'User was registered and logged in successfully!',
                          accessToken: generateTokenFromUserId(user.id),
           });
        });
      }
  )
    .catch((err: Error) => {
      response.status(500).json({ message: err.message });
    });
};

export const logInUser = (request: IReq<LogInRequest>, response: IRes) => {
  User.findOne({
    where: {
      [Op.or]: [
        { username: request.body.usernameOrEmail },
        { email: request.body.usernameOrEmail },
      ],
    },
  })
    .then((user) => {
      if (!user) {
        return response.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        request.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return response.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      user.getRoles().then((roles) => {
        const authorities=roles.map(r =>`ROLE_${r.name.toUpperCase()}`)

        response.status(200).send({
          message: 'User was logged in successfully!',
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: generateTokenFromUserId(user.id),
        });
      });
    })
    .catch((err) => {
      response.status(500).send({ message: err.message });
    });
};

export const logOutUser = (request: IReq<LogOutRequest>, response: IRes) => {
  response.status(200).send({
    message: 'User was logged out successfully!',
    accessToken: generateLogoutTokenFromToken(request.body.accessToken)
  }) 
}
