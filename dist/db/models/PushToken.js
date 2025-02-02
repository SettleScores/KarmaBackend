"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushToken = void 0;
const sequelize_1 = require("sequelize");
const postgreConnection_1 = __importDefault(require("../postgreConnection"));
class PushToken extends sequelize_1.Model {
}
exports.PushToken = PushToken;
PushToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: new sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
    },
}, {
    tableName: 'push_tokens',
    sequelize: postgreConnection_1.default,
});
