"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const User_1 = require("@src/db/models/User");
const authenticate = (request, response, next) => {
    if (request.headers.authorization === undefined ||
        request.headers.authorization === null) {
        response.status(401).send();
        return;
    }
    const token = request.headers.authorization || '';
    const tokenAfterSplit = token.split(" ")[1];
    if (tokenAfterSplit === "") {
        response.status(401).json();
    }
    else {
        jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret, (err, result) => {
            if (err) {
                response.status(401).send();
            }
            else if (result) {
                let decoded;
                try {
                    decoded = jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret);
                }
                catch (err) {
                }
                User_1.User.findOne({
                    where: { id: decoded.id },
                }).then((user) => {
                    if (!user) {
                        return response.status(404).send();
                    }
                    delete user.password;
                    request.user = user;
                    next();
                });
            }
            else {
                response.status(401).send();
            }
        });
    }
};
exports.authenticate = authenticate;
