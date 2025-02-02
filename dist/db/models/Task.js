"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const sequelize_1 = require("sequelize");
const postgreConnection_1 = __importDefault(require("../postgreConnection"));
class Task extends sequelize_1.Model {
}
exports.Task = Task;
Task.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
}, {
    tableName: 'tasks',
    sequelize: postgreConnection_1.default,
});
