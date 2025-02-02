"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./models/User");
const Role_1 = require("./models/Role");
User_1.User.belongsToMany(Role_1.Role, { through: 'user_role' });
Role_1.Role.belongsToMany(User_1.User, { through: 'user_role' });
