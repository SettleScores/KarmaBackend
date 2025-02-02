"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutUser = exports.logInUser = exports.createUser = void 0;
const User_1 = require("@src/db/models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const generateToken_1 = require("@src/util/generateToken");
const generateToken_2 = require("@src/util/generateToken");
const createUser = (request, response) => {
    const generatedPassword = bcrypt_1.default.hashSync(request.body.password, 8);
    return User_1.User.create({
        fullName: request.body.fullName,
        email: request.body.email,
        gender: request.body.gender,
        username: request.body.username,
        password: generatedPassword,
        rankId: 1,
    })
        .then(user => {
        user.setRoles([1]).then(() => {
            response.send({ message: 'User was registered and logged in successfully!',
                accessToken: (0, generateToken_1.generateTokenFromUserId)(user.id),
            });
        });
    })
        .catch((err) => {
        response.status(500).json({ message: err.message });
    });
};
exports.createUser = createUser;
const logInUser = (request, response) => {
    User_1.User.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { username: request.body.usernameOrEmail },
                { email: request.body.usernameOrEmail },
            ],
        },
    })
        .then((user) => {
        if (!user) {
            return response.status(404).send({ message: 'User Not found.' });
        }
        if (user.password == null)
            return;
        const passwordIsValid = bcrypt_1.default.compareSync(request.body.password, user.password);
        if (!passwordIsValid) {
            return response.status(401).send({
                accessToken: null,
                message: 'Invalid Password!',
            });
        }
        user.getRoles().then((roles) => {
            const authorities = roles.map(r => `ROLE_${r.name.toUpperCase()}`);
            response.status(200).send({
                message: 'User was logged in successfully!',
                id: user.id,
                username: user.username,
                email: user.email,
                roles: authorities,
                accessToken: (0, generateToken_1.generateTokenFromUserId)(user.id),
            });
        });
    })
        .catch((err) => {
        response.status(500).send({ message: err.message });
    });
};
exports.logInUser = logInUser;
const logOutUser = (request, response) => {
    response.status(200).send({
        message: 'User was logged out successfully!',
        accessToken: (0, generateToken_2.generateLogoutTokenFromToken)(request.body.accessToken)
    });
};
exports.logOutUser = logOutUser;
