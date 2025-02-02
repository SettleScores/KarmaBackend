"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rank = void 0;
const sequelize_1 = require("sequelize");
const postgreConnection_1 = __importDefault(require("../postgreConnection"));
class Rank extends sequelize_1.Model {
}
exports.Rank = Rank;
Rank.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    points: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    tableName: 'ranks',
    sequelize: postgreConnection_1.default,
});
