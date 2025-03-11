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
exports.creepInTheTask = exports.validateTask = exports.uploadTheFile = exports.getAllTasks = exports.getLiterallyAllTasks = void 0;
const Task_1 = require("@src/db/models/Task");
const TaskStatus_1 = require("@src/db/models/TaskStatus");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const generateToken_1 = require("@src/util/generateToken");
const PushToken_1 = require("@src/db/models/PushToken");
const messaging_1 = require("firebase-admin/messaging");
const jet_logger_1 = __importDefault(require("jet-logger"));
const getLiterallyAllTasks = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenAfterSplit } = (0, generateToken_1.extractToken)(request);
    const userId = jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id;
    console.log(`${userId} is requesting all the tasks`);
    const result = yield Task_1.Task.findAll();
    response.status(200).send({
        tasks: result,
    });
});
exports.getLiterallyAllTasks = getLiterallyAllTasks;
const getAllTasks = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { tokenAfterSplit } = (0, generateToken_1.extractToken)(request);
    const userId = jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id;
    const literal = `(SELECT DISTINCT \"taskId\" FROM tasks_statuses WHERE \"userId\" = ${userId})`;
    const tasksBunch = yield Task_1.Task.findAll({
        where: {
            id: {
                [sequelize_1.Op.notIn]: sequelize_2.Sequelize.literal(literal)
            }
        }
    });
    response.status(200).send({
        tasks: tasksBunch,
    });
});
exports.getAllTasks = getAllTasks;
const uploadTheFile = (request, response) => {
    try {
        TaskStatus_1.TaskStatus.destroy({ where: { taskId: request.body.taskId } });
        TaskStatus_1.TaskStatus.create({
            userId: request.user.id,
            fileName: request.body.filename,
            taskId: request.body.taskId,
            status: 'Pending',
        });
        response.status(200).json({ success: 'file upload successful' });
    }
    catch (error) {
        response.status(500).json({ error: error });
    }
};
exports.uploadTheFile = uploadTheFile;
const validateTask = (request, response) => {
    const id = request.params.id;
    const approve = request.body.approve;
    const reason = request.body.rejectReason;
    const userId = request.body.userId;
    const newStatus = approve ? 'Done' : 'Rejected';
    if (!Number.isInteger(Number(id))) {
        return response.status(401).send('Invalid id value');
    }
    TaskStatus_1.TaskStatus.update({
        status: newStatus,
        rejectReason: request.body.rejectReason,
    }, {
        where: {
            id: id,
        },
        returning: true,
    }).then(([_, obj]) => {
        jet_logger_1.default.info('Task status for user ' + userId + ' updated: ' + newStatus);
        response.status(200).send(obj[0]);
        jet_logger_1.default.info('Looking for a push token');
        PushToken_1.PushToken.findOne({
            where: {
                userId,
            },
        }).then(token => {
            const devicePushToken = token === null || token === void 0 ? void 0 : token.dataValues.token;
            jet_logger_1.default.info('The token is: ' + devicePushToken);
            if (!devicePushToken)
                return;
            const message = {
                notification: {
                    title: 'Your task is ' + (approve ? 'approved' : 'rejected'),
                    body: approve ? 'Keep it up!' : reason,
                },
                token: devicePushToken,
            };
            jet_logger_1.default.info('Sending the message: ________' + JSON.stringify(message));
            (0, messaging_1.getMessaging)().send(message);
        }).catch(err => jet_logger_1.default.err(err));
    }).catch(err => {
        response.status(500).send(err);
    });
};
exports.validateTask = validateTask;
const creepInTheTask = (request, response) => {
    const userId = request.user.id;
    TaskStatus_1.TaskStatus.findOne({
        where: {
            [sequelize_1.Op.and]: [{ userId: userId }, { taskId: request.body.taskId }],
        },
    }).then((taskStatus) => {
        if (!taskStatus) {
            TaskStatus_1.TaskStatus.create({
                userId: userId,
                fileName: '',
                taskId: request.body.taskId,
                status: 'Working',
            });
        }
        response.status(201).json({
            success: `Changed task ${request.body.taskId} status to 'Working'`,
            taskId: request.body.taskId,
        });
    });
};
exports.creepInTheTask = creepInTheTask;
