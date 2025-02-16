"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./models/User");
const Role_1 = require("./models/Role");
const TaskStatus_1 = require("./models/TaskStatus");
User_1.User.belongsToMany(Role_1.Role, { through: 'user_role', foreignKey: 'userId' });
Role_1.Role.belongsToMany(User_1.User, { through: 'user_role', foreignKey: 'roleId' });
User_1.User.hasMany(TaskStatus_1.TaskStatus, { foreignKey: 'userId', as: 'tasks' });
TaskStatus_1.TaskStatus.belongsTo(User_1.User, { foreignKey: 'userId', as: 'user' });
