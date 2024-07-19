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

function answerHelloKarma(_: IReq, response: IRes) {
  return response.status(HttpStatusCodes.OK).json({ message: 'Hello Karma' });
}

async function getAllRoles(_: IReq, response: IRes) {
  const roles = await Role.findAll({});
  response.status(HttpStatusCodes.OK).json(roles);
}

async function getAllUsers(_: IReq, response: IRes) {
  const users = await User.findAll({});
  response.status(HttpStatusCodes.OK).json(users);
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
  console.log('qqq_KarmaRoutes_uploadFile');

  return uploadTheFile(request as IAuthReq, response);
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
} as const;
