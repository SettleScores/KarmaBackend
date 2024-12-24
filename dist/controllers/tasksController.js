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
exports.creepInTheTask = exports.uploadTheFile = exports.getAllTasks = void 0;
const Task_1 = require("@src/db/models/Task");
const TaskStatus_1 = require("@src/db/models/TaskStatus");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const generateToken_1 = require("@src/util/generateToken");
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
        const { requestAny, tokenAfterSplit } = (0, generateToken_1.extractToken)(request);
        TaskStatus_1.TaskStatus.destroy({ where: { taskId: requestAny.body.taskId } });
        TaskStatus_1.TaskStatus.create({
            userId: jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id,
            fileName: requestAny.body.filename,
            taskId: requestAny.body.taskId,
            status: 'Pending',
        });
        response.status(200).json({ success: 'file upload successful' });
    }
    catch (error) {
        response.status(500).json({ error: error });
    }
};
exports.uploadTheFile = uploadTheFile;
const creepInTheTask = (request, response) => {
    const { requestAny, tokenAfterSplit } = (0, generateToken_1.extractToken)(request);
    const userId = jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id;
    TaskStatus_1.TaskStatus.findOne({
        where: {
            [sequelize_1.Op.and]: [{ userId: userId }, { taskId: requestAny.body.taskId }],
        },
    }).then((taskStatus) => {
        if (!taskStatus) {
            TaskStatus_1.TaskStatus.create({
                userId: userId,
                fileName: '',
                taskId: requestAny.body.taskId,
                status: 'Working',
            });
        }
        response.status(201).json({
            success: `Changed task ${requestAny.body.taskId} status to \'Working\'`,
            taskId: requestAny.body.taskId,
        });
    });
};
exports.creepInTheTask = creepInTheTask;
