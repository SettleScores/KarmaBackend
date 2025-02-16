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
exports.downloadFile = exports.streamVideo = exports.getVideoUrl = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const SAFE_DIRECTORY = path_1.default.join(__dirname, '../../uploads');
const uuid_1 = require("uuid");
const tempurls = {};
const getVideoUrl = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = request.params.filename;
    if (!filename || typeof filename !== 'string') {
        return response.status(400).send('Filename is required');
    }
    const userRoles = yield request.user.getRoles();
    const isAdmin = !!userRoles.find(r => r.name === 'admin');
    if (!isAdmin)
        return response.status(401).send('Unauthorized');
    filename = path_1.default.basename(filename);
    const filePath = path_1.default.join(SAFE_DIRECTORY, filename);
    if (!filePath.startsWith(SAFE_DIRECTORY))
        return response.status(403).send('Access denied');
    if (!fs_1.default.existsSync(filePath))
        return response.status(404).send('File not found');
    if (!filePath.includes('.mp4'))
        return response.status(404).send('File not found');
    const videoId = (0, uuid_1.v4)();
    tempurls[videoId] = filePath;
    const expireInMiliseconds = 1000 * 60 * 30;
    setTimeout(() => delete tempurls[videoId], expireInMiliseconds);
    response.status(200).send({ url: videoId, expireInMiliseconds });
});
exports.getVideoUrl = getVideoUrl;
const streamVideo = (request, response) => {
    const id = request.params.id;
    const filePath = tempurls[id];
    if (!filePath)
        return response.status(404).send('Not found');
    const stat = fs_1.default.statSync(filePath);
    response.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
    });
    fs_1.default.createReadStream(filePath).pipe(response);
};
exports.streamVideo = streamVideo;
const downloadFile = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filename = request.params.filename;
        if (!filename || typeof filename !== 'string') {
            return response.status(400).send('Filename is required');
        }
        const userRoles = yield request.user.getRoles();
        const isAdmin = !!userRoles.find(r => r.name === 'admin');
        if (!isAdmin)
            return response.status(401).send('Unauthorized');
        filename = path_1.default.basename(filename);
        const filePath = path_1.default.join(SAFE_DIRECTORY, filename);
        if (!filePath.startsWith(SAFE_DIRECTORY)) {
            return response.status(403).send('Access denied');
        }
        if (!fs_1.default.existsSync(filePath)) {
            return response.status(404).send('File not found');
        }
        response.sendFile(filePath);
    }
    catch (error) {
        response.status(500).json({ error: error });
    }
});
exports.downloadFile = downloadFile;
