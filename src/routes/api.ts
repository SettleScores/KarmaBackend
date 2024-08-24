import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import User from '@src/models/User';
import UserRoutes from './UserRoutes';
import KarmaRoutes from '@src/routes/KarmaRoutes';
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from '@src/middleware/verifySignUp';

import { authenticate } from '@src/middleware/authenticateToken';
import { prepareLoader } from '@src/middleware/prepareFileUploader';

/// import multer from 'multer';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(
  Paths.Users.Get,
  UserRoutes.getAll,
);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  UserRoutes.add,
);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  UserRoutes.update,
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserRoutes.delete,
);

const karmaRouter = Router();
karmaRouter.get(
    Paths.Karma.Hello,
    KarmaRoutes.answerHelloKarma,
);

karmaRouter.get(
  Paths.Karma.Roles,
  KarmaRoutes.getAllRoles,
);

karmaRouter.get(
  Paths.Karma.Users,
  KarmaRoutes.getAllUsers,
);

karmaRouter.post(
  Paths.Karma.Register,
  [ checkDuplicateUsernameOrEmail, checkRolesExisted ], /// in Express's Router second param is array of middlewares
  KarmaRoutes.registerUser,
);

karmaRouter.post(
  Paths.Karma.Login,
  KarmaRoutes.loginUser,
)

karmaRouter.post(
  Paths.Karma.Logout,
  KarmaRoutes.logoutUser,
)

karmaRouter.get(
  Paths.Karma.Tasks,
  authenticate,
  KarmaRoutes.getTasks,
)

 karmaRouter.post(
   Paths.Karma.UploadFile,
   [ authenticate, prepareLoader() ],
   KarmaRoutes.uploadFile
 );

 karmaRouter.post(
  Paths.Karma.CreepInTask,
  authenticate,
  KarmaRoutes.creepInTask
);

karmaRouter.get(
  Paths.Karma.User,
  authenticate,
  KarmaRoutes.getUserProfile,
);

 // Add UserRouter
 apiRouter.use(Paths.Users.Base, userRouter);

/// Add KarmaRouter
apiRouter.use(Paths.Karma.Base, karmaRouter);


// **** Export default **** //

export default apiRouter;
