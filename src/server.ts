/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";

import "express-async-errors";

import BaseRouter from "@src/routes/api";
import Paths from "@src/constants/Paths";

import EnvVars from "@src/constants/EnvVars";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import { NodeEnvs } from "@src/constants/misc";
import { RouteError } from "@src/other/classes";
import sequelize from "./db/postgreConnection";
import { Role } from "./db/models/Role";
import { Rank } from "./db/models/Rank";
import { User } from "./db/models/User";
import { Task } from "./db/models/Task";
import { TaskStatus } from "./db/models/TaskStatus";
import "./db/associations";
import { TaskStatusType } from "./db/models/TaskStatus";
import { ENUM } from "sequelize";
import { PushToken } from "./db/models/PushToken";

import { EnumDataType } from "sequelize";

import bcrypt from "bcrypt";
import cors from "cors";
import populateInitialMaintenanceData from "./usersPopulation";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase-admin/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging } from "firebase-admin/messaging";
var admin = require("firebase-admin");

var serviceAccount = require(EnvVars.Firebase.PrivateKeyPath);

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
  app.use(morgan("dev"));
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
// const viewsDir = path.join(__dirname, 'views');
// app.set('views', viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "../ui/dist");
app.use(express.static(staticDir));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).send("API endpoint not found");
  }
  res.sendFile(path.join(__dirname, "../ui/dist", "index.html"));
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
sequelize.sync().then(() => {
  console.log("Recreaing database from scratch");

  populateInitialRolesData();

  populateInitialRanksData();

  populateInitialMaintenanceData();

  populateInitialTasksData();

  populateInitialTasksStatusesData();

  populateInitialPushTokensData();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('qqq Private key path: ' + EnvVars.Firebase.PrivateKeyPath);

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAr7nGOCR0MVffORx_WS6T7ypNf0qFJO7U",
//   authDomain: "karma-18c4c.firebaseapp.com",
//   projectId: "karma-18c4c",
//   storageBucket: "karma-18c4c.firebasestorage.app",
//   messagingSenderId: "352593909346",
//   appId: "1:352593909346:web:aa620e397125f292cba33b"
// };

// Initialize Firebase
///const app = initializeApp(firebaseConfig);

  // This registration token comes from the client FCM SDKs.
  const registrationToken = "cg6dGx36TNG_f2zE8-LbsX:APA91bHYCNlRu5P_jEKf1MUyvhoWZnRD8GMa4QWlNXdz1-UUBdtvIxFtNMMg8_TUiHLEOd6S368PtHAQQg_S6o9wJLNcrJQdXCa8j2BPJJbyuG0DqAeqvLE"; /// This token goes from device, where it is generated via Firebase SDK

  const message = {
    notification: {
      title: "KarmaApp",
      body: "Do you want to complete the task?",
    },
    token: registrationToken,
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

function populateInitialRanksData() {
  Rank.create({
    id: 1,
    name: "Baby boy",
    points: 0,
  });

  Rank.create({
    id: 2,
    name: "Mama's boy",
    points: 100,
  });

  Rank.create({
    id: 3,
    name: "Nasty toddler",
    points: 200,
  });

  Rank.create({
    id: 4,
    name: "Emotional hurricane 🌀",
    points: 300,
  });

  Rank.create({
    id: 5,
    name: "Almost human",
    points: 400,
  });

  Rank.create({
    id: 6,
    name: "Balanced and smart ♎",
    points: 500,
  });

  Rank.create({
    id: 7,
    name: "Lonely Jedi",
    points: 600,
  });

  Rank.create({
    id: 8,
    name: "Needy narcissist",
    points: 700,
  });

  Rank.create({
    id: 9,
    name: "Godlike",
    points: 800,
  });

  Rank.create({
    id: 10,
    name: "Nirvana level",
    points: 900,
  });

  Rank.create({
    id: 11,
    name: "Diamond member",
    points: 1000,
  });
}

function populateInitialRolesData() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

// function populateInitialMaintenanceData() {
//   User.create({
//     fullName: 'Michael Kapustey',
//     email: 'michaelkapustey@gmail.com',
//     gender: 'male',
//     username: 'Naoru',
//     password: '111',
//     rankId: 1,
//   }).then((user) => user.setRoles([3]));

//   User.create({
//     fullName: 'Vlad Hanych',
//     email: 'vvh.uzh@gmail.com',
//     gender: 'male',
//     username: 'SettleScores',
//     password: '222',
//     rankId: 1,
//   }).then((user) => user.setRoles([3]));

//   User.create({
//     fullName: 'Daria Titova',
//     email: 'daria@gmail.com', /// Removed Daria's real email dariatitova1192@gmail.com to avoid clashes duting registration)
//     gender: 'female',
//     username: 'Damato',
//     password: '333',
//     rankId: 1,
//   }).then((user) => user.setRoles([3]));

//   User.create({
//     fullName: 'Moderator Moderatorovych',
//     email: 'moderator@gmail.com',
//     gender: 'male',
//     username: 'Moder',
//     password: '444',
//     rankId: 1,
//   }).then((user) => user.setRoles([2]));

//   User.create({
//     fullName: 'User Testovych',
//     email: 'user@gmail.com',
//     gender: 'male',
//     username: 'User',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'Admin Adminovych',
//     email: 'admin@gmail.com',
//     gender: 'male',
//     username: 'Admin',
//     password: bcrypt.hashSync('6666', 8),
//     rankId: 1,
//   }).then((user) => user.setRoles([3]));

// // **** Additional users region **** //

//   User.create({
//     fullName: 'User Additionalych1',
//     email: 'useradd1@gmail.com',
//     gender: 'male',
//     username: 'Useradd1',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych2',
//     email: 'useradd2@gmail.com',
//     gender: 'male',
//     username: 'Useradd2',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych3',
//     email: 'useradd3@gmail.com',
//     gender: 'male',
//     username: 'Useradd3',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych4',
//     email: 'useradd4@gmail.com',
//     gender: 'male',
//     username: 'Useradd4',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych5',
//     email: 'useradd5@gmail.com',
//     gender: 'male',
//     username: 'Useradd5',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych6',
//     email: 'useradd6@gmail.com',
//     gender: 'male',
//     username: 'Useradd6',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych7',
//     email: 'useradd7@gmail.com',
//     gender: 'male',
//     username: 'Useradd7',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych8',
//     email: 'useradd8@gmail.com',
//     gender: 'male',
//     username: 'Useradd8',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych9',
//     email: 'useradd9@gmail.com',
//     gender: 'male',
//     username: 'Useradd9',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych10',
//     email: 'useradd10@gmail.com',
//     gender: 'male',
//     username: 'Useradd10',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych11',
//     email: 'useradd11@gmail.com',
//     gender: 'male',
//     username: 'Useradd11',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych12',
//     email: 'useradd12@gmail.com',
//     gender: 'male',
//     username: 'Useradd12',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych13',
//     email: 'useradd13@gmail.com',
//     gender: 'male',
//     username: 'Useradd13',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych14',
//     email: 'useradd14@gmail.com',
//     gender: 'male',
//     username: 'Useradd14',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych15',
//     email: 'useradd15@gmail.com',
//     gender: 'male',
//     username: 'Useradd15',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych16',
//     email: 'useradd16@gmail.com',
//     gender: 'male',
//     username: 'Useradd16',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych17',
//     email: 'useradd17@gmail.com',
//     gender: 'male',
//     username: 'Useradd17',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych18',
//     email: 'useradd18@gmail.com',
//     gender: 'male',
//     username: 'Useradd18',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych19',
//     email: 'useradd19@gmail.com',
//     gender: 'male',
//     username: 'Useradd19',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));

//   User.create({
//     fullName: 'User Additionalych20',
//     email: 'useradd20@gmail.com',
//     gender: 'male',
//     username: 'Useradd20',
//     password: '555',
//     rankId: 1,
//   }).then((user) => user.setRoles([1]));
// }

function populateInitialTasksData() {
  Task.create({
    description:
      'Go to the contact list and text "How are you?" someone you didn\'t talk for a while',
  });

  Task.create({
    description:
      "Contact your cousins or far away relatives you didn't talk to forever",
  });

  Task.create({
    description:
      "Come over to any homeless person and ask if they need any help. Try to help them",
  });

  Task.create({
    description: "Collect plastic bottles for 1 week and try to recycle them",
  });

  Task.create({
    description: "Try to go vegan for 1 day",
  });

  Task.create({
    description:
      "Take care about your health. Make appointment and visit a dentist for a checkup",
  });

  Task.create({
    description: "Fix something in the house, that need a fix",
  });

  Task.create({
    description: "Clean inside your car",
  });

  Task.create({
    description:
      "To the laundry of the things that are not get washed frequently: blankets, pillow cases, etc",
  });

  Task.create({
    description: "Visit a concert",
  });

  Task.create({
    description: "Buy natural flowers to decorate your house",
  });

  Task.create({
    description: "Go to the gym and do a good workout",
  });
}

function populateInitialTasksStatusesData() {
  TaskStatus.create({
    userId: -1,
    taskId: -1,
    fileName: "_",
    status: "Unknown",
  });
}

function populateInitialPushTokensData() {
  PushToken.create({
    userId: -1,
    token: "_",
  });
}

// **** Export default **** //

export default app;
