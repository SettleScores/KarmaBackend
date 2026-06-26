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
const fs_1 = __importDefault(require("fs"));
require("express-async-errors");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const api_1 = __importDefault(require("@src/routes/api"));
const swagger_1 = __importDefault(require("@src/swagger"));
const Paths_1 = __importDefault(require("@src/constants/Paths"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const HttpStatusCodes_1 = __importDefault(require("@src/constants/HttpStatusCodes"));
const misc_1 = require("@src/constants/misc");
const classes_1 = require("@src/other/classes");
const postgreConnection_1 = __importDefault(require("./db/postgreConnection"));
require("./db/associations");
const cors_1 = __importDefault(require("cors"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const seed_1 = require("./seed");
const serviceAccount = require(path_1.default.resolve(process.cwd(), EnvVars_1.default.Firebase.PrivateKeyPath));
console.log('qqq encore Firebase loaded for project:', serviceAccount.project_id);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
console.log('qqq Private key path: ' + EnvVars_1.default.Firebase.PrivateKeyPath);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(EnvVars_1.default.CookieProps.Secret));
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Dev.valueOf()) {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)((tokens, req, res) => {
        const logMessage = [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens['response-time'](req, res) + 'ms',
        ].join(' ');
        if (res.statusCode >= 400) {
            jet_logger_1.default.err(logMessage);
        }
        else {
            jet_logger_1.default.info(logMessage);
        }
        return null;
    }));
}
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Production.valueOf()) {
    app.use((0, helmet_1.default)());
}
app.use(Paths_1.default.Base, api_1.default);
app.use(Paths_1.default.Docs, (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: Object.assign(Object.assign({}, helmet_1.default.contentSecurityPolicy.getDefaultDirectives()), { 'script-src': ["'self'", "'unsafe-inline'"], 'style-src': ["'self'", "'unsafe-inline'", 'https:'], 'img-src': ["'self'", 'data:', 'https:'] }),
    },
}), swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, { customSiteTitle: 'Karma App API Docs' }));
const LOGS_DIR = './';
app.get('/logs', (req, res) => {
    fs_1.default.readdir(LOGS_DIR, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }
        const logFiles = files.filter(file => file.endsWith('.log'));
        const fileDetails = logFiles.map(file => {
            const filePath = path_1.default.join(LOGS_DIR, file);
            return {
                name: file,
                time: fs_1.default.statSync(filePath).birthtime,
                content: fs_1.default.readFileSync(filePath, 'utf8'),
            };
        });
        fileDetails.sort((a, b) => a.time.getTime() - b.time.getTime());
        res.send(`
            <html>
            <head><title>Logs</title></head>
            <body>
                <h1>Log Files</h1>
                ${fileDetails.map(f => `<h2>${f.name} (${f.time.toISOString()})</h2><pre>${f.content}</pre>`).join('<hr>')}
            </body>
            </html>
        `);
    });
});
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
const staticDir = path_1.default.join(__dirname, '../ui/dist');
app.use(express_1.default.static(staticDir));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).send('API endpoint not found');
    }
    res.sendFile(path_1.default.join(__dirname, '../ui/dist', 'index.html'));
});
postgreConnection_1.default.sync({ force: true }).then(() => {
    (0, seed_1.seed)();
});
exports.default = app;
