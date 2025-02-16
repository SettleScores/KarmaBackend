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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRolesExisted = exports.checkDuplicateUsernameOrEmail = void 0;
const User_1 = require("@src/db/models/User");
const Role_1 = require("@src/db/models/Role");
const checkDuplicateUsernameOrEmail = (request, response, next) => {
    User_1.User.findOne({
        where: {
            username: request.body.username,
        },
    }).then((user) => {
        if (user) {
            response.status(400).send({
                message: 'Failed! Username is already in use!',
            });
            return;
        }
        User_1.User.findOne({
            where: {
                email: request.body.email,
            },
        }).then((user) => {
            if (user) {
                response.status(400).send({
                    message: 'Failed! Email is already in use!',
                });
                return;
            }
            next();
        });
    });
};
exports.checkDuplicateUsernameOrEmail = checkDuplicateUsernameOrEmail;
const checkRolesExisted = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.roles) {
        const roles = yield Role_1.Role.findAll({});
        const roleNames = roles.map(r => r.name);
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!roleNames.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: 'Failed! Role does not exist = ' + req.body.roles[i],
                });
                return;
            }
        }
    }
    next();
});
exports.checkRolesExisted = checkRolesExisted;
