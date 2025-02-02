"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./pre-start");
const jet_logger_1 = __importDefault(require("jet-logger"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const server_1 = __importDefault(require("./server"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const options = {
    key: fs_1.default.readFileSync('selfsigned.key'),
    cert: fs_1.default.readFileSync('selfsigned.crt'),
};
const serversecure = https_1.default.createServer(options, server_1.default);
const servernotsecure = http_1.default.createServer(server_1.default);
const SERVER_START_MSG = ('Express server started on port: ' +
    EnvVars_1.default.Port.toString());
serversecure.listen(EnvVars_1.default.Port, () => jet_logger_1.default.info(SERVER_START_MSG));
servernotsecure.listen('8888', () => jet_logger_1.default.info(SERVER_START_MSG));
