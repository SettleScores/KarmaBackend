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
  populateInitialData();
  populateInitialMaintenanceData();
});

function populateInitialData() {
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
    ///id: 3,
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

// **** Export default **** //

export default app;
