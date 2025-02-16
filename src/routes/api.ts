import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import User from '@src/models/User';
import UserRoutes from './UserRoutes';
import KarmaRoutes from '@src/routes/KarmaRoutes';
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from '@src/middleware/verifySignUp';

import { authenticate } from '@src/middleware/authenticateToken';
import { prepareLoader } from '@src/middleware/prepareFileUploader';
import { IAuthReq, IReq } from './types/types';
import { IRes } from './types/express/misc';

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
  [checkDuplicateUsernameOrEmail, checkRolesExisted], /// in Express's Router second param is array of middlewares
  KarmaRoutes.registerUser,
);

karmaRouter.post(
  Paths.Karma.Login,
  KarmaRoutes.loginUser,
);

karmaRouter.post(
  Paths.Karma.Logout,
  KarmaRoutes.logoutUser,
);

karmaRouter.get(
  Paths.Karma.Tasks,
  authenticate,
  authType(KarmaRoutes.getTasks),
);

karmaRouter.get(
  Paths.Karma.AllTasks,
  authenticate,
  authType(KarmaRoutes.getAllTasks),
);

karmaRouter.post(
  Paths.Karma.UploadFile,
  [authenticate, prepareLoader()],
  authType(KarmaRoutes.uploadFile),
);

karmaRouter.post<{ taskId: string; }>(
  Paths.Karma.CreepInTask,
  authenticate,
  authType(KarmaRoutes.creepInTask),
);

karmaRouter.get(
  Paths.Karma.User,
  authenticate,
  authType(KarmaRoutes.getUserProfile),
);

//FIXME super weird type error if I put correct type
karmaRouter.post<{ body: string }>(
  Paths.Karma.ValidateTaskStatus,
  authenticate,
  authType(KarmaRoutes.validateTask),
);

karmaRouter.post<{ title: string; body: any; }>(
  Paths.Karma.Push,
  authenticate,
  authType(KarmaRoutes.pushPush),
);

karmaRouter.post<{ token: string }>(
  Paths.Karma.PushToken,
  authenticate,
  authType(KarmaRoutes.pushToken),
);

karmaRouter.post<{ body: string, title: string }>(
  Paths.Karma.PushForAll,
  authenticate,
  authType(KarmaRoutes.pushPushForAll),
);

karmaRouter.get(
  Paths.Karma.File,
  authenticate,
  authType(KarmaRoutes.downloadFile),
);

karmaRouter.get(
  Paths.Karma.Video,
  authenticate,
  authType(KarmaRoutes.getVideoUrl),
);

karmaRouter.get(
  Paths.Karma.Stream,
  KarmaRoutes.streamVideo,
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);

/// Add KarmaRouter
apiRouter.use(Paths.Karma.Base, karmaRouter);


function authType<T>(handler: (req: IAuthReq<T>, res: IRes) => void) {
  return (req: IReq<T>, res: IRes) => handler(req as IAuthReq<T>, res);
}

// **** Export default **** //

export default apiRouter;
