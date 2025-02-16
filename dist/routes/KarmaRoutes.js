"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Role_1 = require("@src/db/models/Role");
const User_1 = require("@src/db/models/User");
const HttpStatusCodes_1 = __importDefault(require("@src/constants/HttpStatusCodes"));
const authController_1 = require("@src/controllers/authController");
const authController_2 = require("@src/controllers/authController");
const authController_3 = require("@src/controllers/authController");
const tasksController_1 = require("@src/controllers/tasksController");
const tasksController_2 = require("@src/controllers/tasksController");
const tasksController_3 = require("@src/controllers/tasksController");
const userController_1 = require("@src/controllers/userController");
const pushesController_1 = require("@src/controllers/pushesController");
const pushesController_2 = require("@src/controllers/pushesController");
const pushesController_3 = require("@src/controllers/pushesController");
const TaskStatus_1 = require("@src/db/models/TaskStatus");
const filesControler_1 = require("@src/controllers/filesControler");
function answerHelloKarma(_, response) {
    return response.status(HttpStatusCodes_1.default.OK).json({ message: 'Hello Karma' });
}
function getAllRoles(_, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = yield Role_1.Role.findAll({});
        response.status(HttpStatusCodes_1.default.OK).json(roles);
    });
}
function getAllUsers(_, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield User_1.User.findAll({ include: [{ model: TaskStatus_1.TaskStatus, as: 'tasks' }] });
        const resultArray = {
            data: users,
            cunt: users.length,
        };
        response.status(HttpStatusCodes_1.default.OK).json(resultArray);
    });
}
exports.default = {
    answerHelloKarma,
    getAllRoles,
    getAllUsers,
    getAllTasks: tasksController_1.getLiterallyAllTasks,
    registerUser: authController_1.createUser,
    loginUser: authController_2.logInUser,
    logoutUser: authController_3.logOutUser,
    getTasks: tasksController_1.getAllTasks,
    uploadFile: tasksController_2.uploadTheFile,
    creepInTask: tasksController_3.creepInTheTask,
    validateTask: tasksController_1.validateTask,
    getUserProfile: userController_1.getTheUserProfile,
    pushPush: pushesController_1.pushTheTempo,
    pushToken: pushesController_2.pushTheToken,
    pushPushForAll: pushesController_3.pushTheTempoForAll,
    downloadFile: filesControler_1.downloadFile,
    getVideoUrl: filesControler_1.getVideoUrl,
    streamVideo: filesControler_1.streamVideo,
};
