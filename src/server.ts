/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';
import sequelize from './db/postgreConnection';
import { Role } from './db/models/Role';
import { User } from './db/models/User';
import { Task } from './db/models/Task';
import './db/associations';


// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// ** Front-End Content ** //

// Set views directory (html)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('/users');
});

// Redirect to login if not logged in.
app.get('/users', (_: Request, res: Response) => {
  return res.sendFile('users.html', { root: viewsDir });
});

//TODO remove force: true to keep the data on server restart.
//TODO figure out initial data population or migration betweeen production and development
sequelize.sync({ force: true }).then(() => {
  console.log('Recreaing database from scratch');
  populateInitialRolesData();

  populateInitialMaintenanceData();

  populateInitialTasksData();
});

function populateInitialRolesData() {
  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'moderator',
  });

  Role.create({
    id: 3,
    name: 'admin',
  });
}

function populateInitialMaintenanceData() {
  User.create({
    fullName: 'Michael Kapustey',
    email: 'michaelkapustey@gmail.com',
    gender: 'male',
    username: 'Naoru',
    password: '111',
  }).then((user) => user.setRoles([3]));

  User.create({
    fullName: 'Vlad Hanych',
    email: 'vvh.uzh@gmail.com',
    gender: 'male',
    username: 'SettleScores',
    password: '222',
  }).then((user) => user.setRoles([3]));

  User.create({
    fullName: 'Daria Titova',
    email: 'dariatitova1192@gmail.com',
    gender: 'female',
    username: 'Damato',
    password: '333',
  }).then((user) => user.setRoles([3]));

  User.create({
    fullName: 'Moderator Moderatorovych',
    email: 'moderator@gmail.com',
    gender: 'male',
    username: 'Moder',
    password: '444',
  }).then((user) => user.setRoles([2]));

  User.create({
    fullName: 'User Testovych',
    email: 'user@gmail.com',
    gender: 'male',
    username: 'User',
    password: '555',
  }).then((user) => user.setRoles([1]));
}

function populateInitialTasksData() {
  Task.create({
    description: 'Go to the contact list and text \"How are you?\" someone you didn\'t talk for a while',
  });

  Task.create({
    description: 'Contact your cousins or far away relatives you didn\'t talk to forever',
  });

  Task.create({
    description: 'Come over to any homeless person and ask if they need any help. Try to help them',
  });

  Task.create({
    description: 'Collect plastic bottles for 1 week and try to recycle them',
  });

  Task.create({
    description: 'Try to go vegan for 1 day',
  });

  Task.create({
    description: 'Take care about your health. Make appointment and visit a dentist for a checkup',
  });

  Task.create({
    description: 'Fix something in the house, that need a fix',
  });

  Task.create({
    description: 'Clean inside your car',
  });

  Task.create({
    description: 'To the laundry of the things that are not get washed frequently: blankets, pillow cases, etc',
  });

  Task.create({
    description: 'Visit a concert',
  });

  Task.create({
    description: 'Buy natural flowers to decorate your house',
  });

  Task.create({
    description: 'Go to the gym and do a good workout',
  });
}

// **** Export default **** //

export default app;
