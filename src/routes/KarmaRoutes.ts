import { Role } from '@src/db/models/Role';
import { User } from '@src/db/models/User';
import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { createUser } from '@src/controllers/authController';
import { logInUser } from '@src/controllers/authController';
import { logOutUser } from '@src/controllers/authController';
import { forgotPassword } from '@src/controllers/authController';
import { ForgotPasswordRequest } from '@src/middleware/verifyForgotPassword';
import { resetPassword } from '@src/controllers/authController';
import { ResetPasswordRequest } from '@src/middleware/verifyResetPassword';
import { getAllTasks as getAllUserTasks, getLiterallyAllTasks, validateTask } from '@src/controllers/tasksController';
import { uploadTheFile } from '@src/controllers/tasksController';
import { creepInTheTask } from '@src/controllers/tasksController';
import { getTheUserProfile } from '@src/controllers/userController';
import { pushTheTempo } from '@src/controllers/pushesController';
import { pushTheToken } from '@src/controllers/pushesController';
import { pushTheTempoForAll } from '@src/controllers/pushesController';
import { TaskStatus } from '@src/db/models/TaskStatus';
import { downloadFile, getVideoUrl, streamVideo } from '@src/controllers/filesControler';

function answerHelloKarma(_: IReq, response: IRes) {
  return response.status(HttpStatusCodes.OK).json({ message: 'Hello Karma' });
}

async function getAllRoles(_: IReq, response: IRes) {
  const roles = await Role.findAll({});

  response.status(HttpStatusCodes.OK).json(roles);
}

async function getAllUsers(_: IReq, response: IRes) {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [{ model: TaskStatus, as: 'tasks' }],
  });

  const resultArray = {
    data: users,
    count: users.length,
  };

  response.status(HttpStatusCodes.OK).json(resultArray);
}

// Тільки проксі-виклик:
async function forgotPasswordProxy(request: IReq<ForgotPasswordRequest>, response: IRes) {
  return forgotPassword(request, response);
}

async function resetPasswordProxy(request: IReq<ResetPasswordRequest>, response: IRes) {
  return resetPassword(request, response);
}

export default {
  answerHelloKarma,
  getAllRoles,
  getAllUsers,
  getAllTasks: getLiterallyAllTasks,
  registerUser: createUser,
  loginUser: logInUser,
  logoutUser: logOutUser,
  forgotPasswordProxy, /// TODO Maybe Rename
  resetPasswordProxy,  /// TODO Maybe Rename
  getTasks: getAllUserTasks,
  uploadFile: uploadTheFile,
  creepInTask: creepInTheTask,
  validateTask,
  getUserProfile: getTheUserProfile,
  pushPush: pushTheTempo,
  pushToken: pushTheToken,
  pushPushForAll: pushTheTempoForAll,
  downloadFile,
  getVideoUrl,
  streamVideo,
} as const;
