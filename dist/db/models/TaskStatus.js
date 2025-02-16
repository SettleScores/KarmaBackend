"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = void 0;
const sequelize_1 = require("sequelize");
const postgreConnection_1 = __importDefault(require("../postgreConnection"));
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
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
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
        type: new sequelize_1.DataTypes.ENUM('Unknown', 'Working', 'Pending', 'Done', 'Rejected'),
        allowNull: false,
    },
    rejectReason: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'tasks_statuses',
    sequelize: postgreConnection_1.default,
});
