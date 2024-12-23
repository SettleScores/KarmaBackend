import { Role } from '@src/db/models/Role';
import { User } from '@src/db/models/User';
import { IReq, IRes } from './types/express/misc';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { createUser } from '@src/controllers/authController';
import { SignUpRequest } from '@src/middleware/verifySignUp';
import { LogInRequest } from '@src/middleware/verifyLogIn';
import { logInUser } from '@src/controllers/authController';
import { logOutUser } from '@src/controllers/authController';
import { LogOutRequest } from '@src/middleware/verifyLogOut';
import { getAllTasks } from '@src/controllers/tasksController';
import { IAuthReq } from './types/types';
import { uploadTheFile } from '@src/controllers/tasksController';
import { creepInTheTask } from '@src/controllers/tasksController';
import { getTheUserProfile } from '@src/controllers/userController';
import { pushTheTempo } from '@src/controllers/pushesController';
import { pushTheToken } from '@src/controllers/pushesController';
import { pushTheTempoForAll } from '@src/controllers/pushesController';

function answerHelloKarma(_: IReq, response: IRes) {
  return response.status(HttpStatusCodes.OK).json({ message: 'Hello Karma' });
}

async function getAllRoles(_: IReq, response: IRes) {
  const roles = await Role.findAll({});

  response.status(HttpStatusCodes.OK).json(roles);
}

async function getAllUsers(_: IReq, response: IRes) {
  const users = await User.findAll({});

  let resultArray = {
    data: users,
    cunt: users.length,
  };

  response.status(HttpStatusCodes.OK).json(resultArray);
}

function registerUser(request: IReq<SignUpRequest>, response: IRes) {
  return createUser(request, response);
}

function loginUser(request: IReq<LogInRequest>, response: IRes) {
  return logInUser(request, response);
}

function logoutUser(request: IReq<LogOutRequest>, response: IRes) {
  return logOutUser(request, response);
} 

function getTasks(request: IReq, response: IRes) {
  return getAllTasks(request as IAuthReq, response);
}

function uploadFile(request: IReq, response: IRes) {
  return uploadTheFile(request as IAuthReq, response);
}

function creepInTask(request: IReq, response: IRes) {
  return creepInTheTask(request as IAuthReq, response);
}

function getUserProfile(request: IReq, response: IRes) {
  return getTheUserProfile(request as IAuthReq, response);
}

function pushPush(request: IReq, response: IRes) {
  return pushTheTempo(request as IAuthReq, response);
}

function pushToken(request: IReq, response: IRes) {
  return pushTheToken(request as IAuthReq, response);
}

function pushPushForAll(request: IReq, response: IRes) {
  return pushTheTempoForAll(request as IAuthReq, response);
}

export default {
  answerHelloKarma,
  getAllRoles,
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  getTasks,
  uploadFile,
  creepInTask,
  getUserProfile,
  pushPush,
  pushToken,
  pushPushForAll,
} as const;
