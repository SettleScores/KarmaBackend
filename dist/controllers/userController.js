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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheUserProfile = void 0;
const User_1 = require("@src/db/models/User");
const Rank_1 = require("@src/db/models/Rank");
const sequelize_1 = require("sequelize");
const TaskStatus_1 = require("@src/db/models/TaskStatus");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const getTheUserProfile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const token = request.headers.authorization || '';
    const tokenAfterSplit = token.split(' ')[1];
    const foundUser = yield User_1.User.findOne({
        where: { id: jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id },
    });
    if (!foundUser) {
        return response.status(404).send({ message: 'User Not found.' });
    }
    const foundUserRank = yield Rank_1.Rank.findOne({ where: { id: foundUser.rankId } });
    const foundUserRankName = foundUserRank === null || foundUserRank === void 0 ? void 0 : foundUserRank.name;
    const workingTasksStatuses = yield TaskStatus_1.TaskStatus.findAll({
        where: {
            [sequelize_1.Op.and]: [
                { userId: foundUser.id },
                { status: 'Working' },
            ],
        },
    });
    const workingTasksCount = workingTasksStatuses.length;
    const pendingTasksStatuses = yield TaskStatus_1.TaskStatus.findAll({
        where: {
            [sequelize_1.Op.and]: [
                { userId: foundUser.id },
                { status: 'Pending' },
            ],
        },
    });
    const pendingTasksCount = pendingTasksStatuses.length;
    return response.status(200).send({
        username: foundUser.username,
        rankName: foundUserRankName,
        working: workingTasksCount,
        pending: pendingTasksCount,
    });
});
exports.getTheUserProfile = getTheUserProfile;
