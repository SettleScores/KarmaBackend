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
import { Rank } from './db/models/Rank';
import { Task } from './db/models/Task';
import { TaskStatus } from './db/models/TaskStatus';
import './db/associations';
import { PushToken } from './db/models/PushToken';
import cors from 'cors';
import populateInitialMaintenanceData from './usersPopulation';

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
const serviceAccount = readFileSync(EnvVars.Firebase.PrivateKeyPath, 'utf8').trim();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('qqq Private key path: ' + EnvVars.Firebase.PrivateKeyPath);

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(cors());
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
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  },
);

// ** Front-End Content ** //

// Set views directory (html)
// const viewsDir = path.join(__dirname, 'views');
// app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, '../ui/dist');
app.use(express.static(staticDir));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send('API endpoint not found');
  }
  res.sendFile(path.join(__dirname, '../ui/dist', 'index.html'));
});

// Nav to users pg by default
// app.get('/', (_: Request, res: Response) => {
//   return res.redirect('/users');
// });

// // Redirect to login if not logged in.
// app.get('/users', (_: Request, res: Response) => {
//   return res.sendFile('users.html', { root: viewsDir });
// });

//TODO remove force: true to keep the data on server restart.
//TODO figure out initial data population or migration betweeen production and development
///sequelize.sync({ force: true }).then(() => {
sequelize.sync({ force: true }).then(() => {
  populateInitialRolesData();

  populateInitialRanksData();

  populateInitialMaintenanceData();

  populateInitialTasksData();

  populateInitialTasksStatusesData();

  populateInitialPushTokensData();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

});

function populateInitialRanksData() {
  Rank.create({
    id: 1,
    name: 'Baby boy',
    points: 0,
  });

  Rank.create({
    id: 2,
    name: 'Mama\'s boy',
    points: 100,
  });

  Rank.create({
    id: 3,
    name: 'Nasty toddler',
    points: 200,
  });

  Rank.create({
    id: 4,
    name: 'Emotional hurricane 🌀',
    points: 300,
  });

  Rank.create({
    id: 5,
    name: 'Almost human',
    points: 400,
  });

  Rank.create({
    id: 6,
    name: 'Balanced and smart ♎',
    points: 500,
  });

  Rank.create({
    id: 7,
    name: 'Lonely Jedi',
    points: 600,
  });

  Rank.create({
    id: 8,
    name: 'Needy narcissist',
    points: 700,
  });

  Rank.create({
    id: 9,
    name: 'Godlike',
    points: 800,
  });

  Rank.create({
    id: 10,
    name: 'Nirvana level',
    points: 900,
  });

  Rank.create({
    id: 11,
    name: 'Diamond member',
    points: 1000,
  });
}

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

function populateInitialTasksData() {
  Task.create({
    description:
      'Go to the contact list and text "How are you?" someone you didn\'t talk for a while',
  });

  Task.create({
    description:
      'Contact your cousins or far away relatives you didn\'t talk to forever',
  });

  Task.create({
    description:
      'Come over to any homeless person and ask if they need any help. Try to help them',
  });

  Task.create({
    description: 'Collect plastic bottles for 1 week and try to recycle them',
  });

  Task.create({
    description: 'Try to go vegan for 1 day',
  });

  Task.create({
    description:
      'Take care about your health. Make appointment and visit a dentist for a checkup',
  });

  Task.create({
    description: 'Fix something in the house, that need a fix',
  });

  Task.create({
    description: 'Clean inside your car',
  });

  Task.create({
    description:
      'To the laundry of the things that are not get washed frequently: blankets, pillow cases, etc',
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

function populateInitialTasksStatusesData() {
  TaskStatus.create({
    userId: -1,
    taskId: -1,
    fileName: '_',
    status: 'Unknown',
  });
}

function populateInitialPushTokensData() {
  PushToken.create({
    userId: -1,
    token: '_',
  });
}

// **** Export default **** //

export default app;
