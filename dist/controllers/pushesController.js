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
exports.pushTheTempoForAll = exports.pushTheToken = exports.pushTheTempo = void 0;
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const messaging_1 = require("firebase-admin/messaging");
const PushToken_1 = require("@src/db/models/PushToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken_1 = require("@src/util/generateToken");
const jet_logger_1 = __importDefault(require("jet-logger"));
const pushTheTempo = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('qqq Private key path: ' + EnvVars_1.default.Firebase.PrivateKeyPath);
    const { tokenAfterSplit } = (0, generateToken_1.extractToken)(request);
    const userId = jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id;
    const pushToken = yield PushToken_1.PushToken.findOne({
        where: {
            userId: userId,
        },
    });
    const devicePushToken = pushToken.dataValues.token;
    const message = {
        notification: {
            title: request.body.title,
            body: request.body.body,
        },
        token: devicePushToken,
    };
    (0, messaging_1.getMessaging)()
        .send(message)
        .then((response) => {
        jet_logger_1.default.info('Successfully sent message: ' + response);
    })
        .catch((error) => {
        jet_logger_1.default.err('Error sending message: ' + error);
    });
});
exports.pushTheTempo = pushTheTempo;
const pushTheToken = (request, response) => {
    console.log('qqq pushTheToken');
    try {
        const { tokenAfterSplit } = (0, generateToken_1.extractToken)(request);
        const userId = jsonwebtoken_1.default.verify(tokenAfterSplit, EnvVars_1.default.Jwt.Secret).id;
        PushToken_1.PushToken.destroy({ where: { userId: userId } });
        PushToken_1.PushToken.create({
            userId: userId,
            token: request.body.token,
        });
        response.status(200).json({ success: 'push token stored successful' });
    }
    catch (error) {
        response.status(500).json({ error: error });
    }
};
exports.pushTheToken = pushTheToken;
const pushTheTempoForAll = (request, response) => {
    jet_logger_1.default.info('pushTheTempoForAll      ___' + JSON.stringify(request.body));
    const notificationText = request.body.body;
    const notificationTitle = request.body.title;
    const messaging = (0, messaging_1.getMessaging)();
    PushToken_1.PushToken.findAll().then((pushTokens) => {
        pushTokens.forEach((pushToken) => {
            var _a;
            jet_logger_1.default.info('pushTheTempoForAll pushToken: ' + ((_a = pushToken === null || pushToken === void 0 ? void 0 : pushToken.dataValues) === null || _a === void 0 ? void 0 : _a.token));
            const message = {
                notification: {
                    title: notificationTitle,
                    body: notificationText,
                },
                token: pushToken.dataValues.token,
            };
            messaging
                .send(message)
                .then((resp) => {
                jet_logger_1.default.info('Successfully sent message: ' + resp);
                response.status(200).send();
            })
                .catch((error) => {
                jet_logger_1.default.err('Error sending message');
                jet_logger_1.default.err(error);
            });
        });
    });
};
exports.pushTheTempoForAll = pushTheTempoForAll;
