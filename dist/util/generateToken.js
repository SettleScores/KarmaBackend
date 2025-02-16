"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = exports.generateLogoutTokenFromToken = exports.generateTokenFromUserId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const generateTokenFromUserId = (userId, expIn = 86400) => jsonwebtoken_1.default.sign({ id: userId }, EnvVars_1.default.Jwt.Secret, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: expIn,
});
exports.generateTokenFromUserId = generateTokenFromUserId;
const generateLogoutTokenFromToken = (accessToken) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(accessToken, EnvVars_1.default.Jwt.Secret);
    }
    catch (err) {
    }
    return (0, exports.generateTokenFromUserId)(decoded.id, 0);
};
exports.generateLogoutTokenFromToken = generateLogoutTokenFromToken;
const extractToken = (request) => {
    const token = request.headers.authorization || '';
    const tokenAfterSplit = token.split(' ')[1];
    return { tokenAfterSplit };
};
exports.extractToken = extractToken;
