"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareLoader = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const prepareLoader = () => {
    const storage = multer_1.default.diskStorage({
        destination: function (request, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (request, file, cb) {
            const randomUuid = (0, uuid_1.v4)();
            const dot = '.';
            request.body.filename = randomUuid + dot + file.originalname.split(dot)[1];
            cb(null, randomUuid + dot + file.originalname.split(dot)[1]);
        },
    });
    const upload = (0, multer_1.default)({ storage: storage });
    return upload.single('file');
};
exports.prepareLoader = prepareLoader;
