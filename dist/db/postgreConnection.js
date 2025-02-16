"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const username = EnvVars_1.default.Postgresql.Username;
const password = EnvVars_1.default.Postgresql.Password;
const dbserver = EnvVars_1.default.Postgresql.Dbserver;
const database = EnvVars_1.default.Postgresql.Database;
const sequelize = new sequelize_1.Sequelize(`postgres://${username}:${password}@${dbserver}/${database}`);
exports.default = sequelize;
