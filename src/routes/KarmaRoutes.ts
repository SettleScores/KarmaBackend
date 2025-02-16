import { Role } from '@src/db/models/Role';
import { User } from '@src/db/models/User';
import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { createUser } from '@src/controllers/authController';
import { logInUser } from '@src/controllers/authController';
import { logOutUser } from '@src/controllers/authController';
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
  const users = await User.findAll({ include: [{ model: TaskStatus, as: 'tasks' }] });

  const resultArray = {
    data: users,
    cunt: users.length,
  };

  response.status(HttpStatusCodes.OK).json(resultArray);
}

export default {
  answerHelloKarma,
  getAllRoles,
  getAllUsers,
  getAllTasks: getLiterallyAllTasks,
  registerUser: createUser,
  loginUser: logInUser,
  logoutUser: logOutUser,
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
