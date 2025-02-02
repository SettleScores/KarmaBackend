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
        const users = yield User_1.User.findAll({});
        let resultArray = {
            data: users,
            cunt: users.length,
        };
        response.status(HttpStatusCodes_1.default.OK).json(resultArray);
    });
}
function registerUser(request, response) {
    return (0, authController_1.createUser)(request, response);
}
function loginUser(request, response) {
    return (0, authController_2.logInUser)(request, response);
}
function logoutUser(request, response) {
    return (0, authController_3.logOutUser)(request, response);
}
function getTasks(request, response) {
    return (0, tasksController_1.getAllTasks)(request, response);
}
function uploadFile(request, response) {
    return (0, tasksController_2.uploadTheFile)(request, response);
}
function creepInTask(request, response) {
    return (0, tasksController_3.creepInTheTask)(request, response);
}
function getUserProfile(request, response) {
    return (0, userController_1.getTheUserProfile)(request, response);
}
function pushPush(request, response) {
    return (0, pushesController_1.pushTheTempo)(request, response);
}
function pushToken(request, response) {
    return (0, pushesController_2.pushTheToken)(request, response);
}
function pushPushForAll(request, response) {
    return (0, pushesController_3.pushTheTempoForAll)(request, response);
}
exports.default = {
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
};
