import { User } from '@src/db/models/User';
import { Role } from '@src/db/models/Role';
import { IRes } from '@src/routes/types/express/misc';
import { IReq } from '@src/routes/types/types';
import { NextFunction } from 'express';

export interface SignUpRequest {
  roles: string[];
  fullName: string;
  email: string;
  gender: string;
  username: string;
  password: string;
}

export const checkDuplicateUsernameOrEmail = (request: IReq<SignUpRequest>, response: IRes, next: NextFunction) => {
  // Username
  User.findOne({
    where: {
      username: request.body.username,
    },
  }).then((user) => {
    if (user) {
      response.status(400).send({
        message: 'Failed! Username is already in use!',
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: request.body.email,
      },
    }).then((user) => {
      if (user) {
        response.status(400).send({
          message: 'Failed! Email is already in use!',
        });
        return;
      }

      next();
    });
  });
};

export const checkRolesExisted = async (req: IReq<SignUpRequest>, res: IRes, next: NextFunction) => {
  if (req.body.roles) {
    //No sence to keep roles in a constant, if we have a table for it
    //This is oversimplified example. 
    //We should pass roleid in sign up request and use some smart Sequelize method 
    //to check if all roles passed in the request are present in the database
    const roles = await Role.findAll({});
    const roleNames = roles.map(r=>r.name);

    for (let i = 0; i < req.body.roles.length; i++) {
      if (!roleNames.includes(req.body.roles[i])) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};
