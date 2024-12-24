"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.TaskStatusType = void 0;
const sequelize_1 = require("sequelize");
const postgreConnection_1 = __importDefault(require("../postgreConnection"));
var TaskStatusType;
(function (TaskStatusType) {
    TaskStatusType["Huj"] = "\u0425\u0443\u0439";
    TaskStatusType["Pizda"] = "\u041F\u0438\u0437\u0434\u0430";
    TaskStatusType["Ggurda"] = "\u0414\u0436\u0438\u0433\u0443\u0440\u0434\u0430";
})(TaskStatusType || (exports.TaskStatusType = TaskStatusType = {}));
class TaskStatus extends sequelize_1.Model {
}
exports.TaskStatus = TaskStatus;
TaskStatus.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    taskId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    fileName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    status: {
        type: new sequelize_1.DataTypes.ENUM('Unknown', 'Working', 'Pending', 'Done'),
        allowNull: false,
    },
}, {
    tableName: 'tasks_statuses',
    sequelize: postgreConnection_1.default,
});
