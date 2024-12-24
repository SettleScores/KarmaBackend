"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const jet_logger_1 = __importDefault(require("jet-logger"));
require("express-async-errors");
const api_1 = __importDefault(require("@src/routes/api"));
const Paths_1 = __importDefault(require("@src/constants/Paths"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const HttpStatusCodes_1 = __importDefault(require("@src/constants/HttpStatusCodes"));
const misc_1 = require("@src/constants/misc");
const classes_1 = require("@src/other/classes");
const postgreConnection_1 = __importDefault(require("./db/postgreConnection"));
const Role_1 = require("./db/models/Role");
const Rank_1 = require("./db/models/Rank");
const Task_1 = require("./db/models/Task");
const TaskStatus_1 = require("./db/models/TaskStatus");
require("./db/associations");
const PushToken_1 = require("./db/models/PushToken");
const cors_1 = __importDefault(require("cors"));
const usersPopulation_1 = __importDefault(require("./usersPopulation"));
const admin = require("firebase-admin");
const serviceAccount = require(EnvVars_1.default.Firebase.PrivateKeyPath);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(EnvVars_1.default.CookieProps.Secret));
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Dev.valueOf()) {
    app.use((0, morgan_1.default)("dev"));
}
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Production.valueOf()) {
    app.use((0, helmet_1.default)());
}
app.use(Paths_1.default.Base, api_1.default);
app.use((err, _, res, next) => {
    if (EnvVars_1.default.NodeEnv !== misc_1.NodeEnvs.Test.valueOf()) {
        jet_logger_1.default.err(err, true);
    }
    let status = HttpStatusCodes_1.default.BAD_REQUEST;
    if (err instanceof classes_1.RouteError) {
        status = err.status;
    }
    return res.status(status).json({ error: err.message });
});
const staticDir = path_1.default.join(__dirname, "../ui/dist");
app.use(express_1.default.static(staticDir));
app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).send("API endpoint not found");
    }
    res.sendFile(path_1.default.join(__dirname, "../ui/dist", "index.html"));
});
postgreConnection_1.default.sync({ force: true }).then(() => {
    populateInitialRolesData();
    populateInitialRanksData();
    (0, usersPopulation_1.default)();
    populateInitialTasksData();
    populateInitialTasksStatusesData();
    populateInitialPushTokensData();
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
});
function populateInitialRanksData() {
    Rank_1.Rank.create({
        id: 1,
        name: "Baby boy",
        points: 0,
    });
    Rank_1.Rank.create({
        id: 2,
        name: "Mama's boy",
        points: 100,
    });
    Rank_1.Rank.create({
        id: 3,
        name: "Nasty toddler",
        points: 200,
    });
    Rank_1.Rank.create({
        id: 4,
        name: "Emotional hurricane 🌀",
        points: 300,
    });
    Rank_1.Rank.create({
        id: 5,
        name: "Almost human",
        points: 400,
    });
    Rank_1.Rank.create({
        id: 6,
        name: "Balanced and smart ♎",
        points: 500,
    });
    Rank_1.Rank.create({
        id: 7,
        name: "Lonely Jedi",
        points: 600,
    });
    Rank_1.Rank.create({
        id: 8,
        name: "Needy narcissist",
        points: 700,
    });
    Rank_1.Rank.create({
        id: 9,
        name: "Godlike",
        points: 800,
    });
    Rank_1.Rank.create({
        id: 10,
        name: "Nirvana level",
        points: 900,
    });
    Rank_1.Rank.create({
        id: 11,
        name: "Diamond member",
        points: 1000,
    });
}
function populateInitialRolesData() {
    Role_1.Role.create({
        id: 1,
        name: "user",
    });
    Role_1.Role.create({
        id: 2,
        name: "moderator",
    });
    Role_1.Role.create({
        id: 3,
        name: "admin",
    });
}
function populateInitialTasksData() {
    Task_1.Task.create({
        description: 'Go to the contact list and text "How are you?" someone you didn\'t talk for a while',
    });
    Task_1.Task.create({
        description: "Contact your cousins or far away relatives you didn't talk to forever",
    });
    Task_1.Task.create({
        description: "Come over to any homeless person and ask if they need any help. Try to help them",
    });
    Task_1.Task.create({
        description: "Collect plastic bottles for 1 week and try to recycle them",
    });
    Task_1.Task.create({
        description: "Try to go vegan for 1 day",
    });
    Task_1.Task.create({
        description: "Take care about your health. Make appointment and visit a dentist for a checkup",
    });
    Task_1.Task.create({
        description: "Fix something in the house, that need a fix",
    });
    Task_1.Task.create({
        description: "Clean inside your car",
    });
    Task_1.Task.create({
        description: "To the laundry of the things that are not get washed frequently: blankets, pillow cases, etc",
    });
    Task_1.Task.create({
        description: "Visit a concert",
    });
    Task_1.Task.create({
        description: "Buy natural flowers to decorate your house",
    });
    Task_1.Task.create({
        description: "Go to the gym and do a good workout",
    });
}
function populateInitialTasksStatusesData() {
    TaskStatus_1.TaskStatus.create({
        userId: -1,
        taskId: -1,
        fileName: "_",
        status: "Unknown",
    });
}
function populateInitialPushTokensData() {
    PushToken_1.PushToken.create({
        userId: -1,
        token: "_",
    });
}
exports.default = app;
