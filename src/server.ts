import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import fs from 'fs';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import BaseRouter from '@src/routes/api';
import swaggerSpec from '@src/swagger';
import Paths from '@src/constants/Paths';
import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';
import sequelize from './db/postgreConnection';
import './db/associations';
import cors from 'cors';
import admin from 'firebase-admin';
import { seed } from './seed';

// eslint-disable-next-line @typescript-eslint/no-var-requires

const serviceAccount = require(
  path.resolve(process.cwd(), EnvVars.Firebase.PrivateKeyPath)
);

console.log('qqq encore Firebase loaded for project:', serviceAccount.project_id);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log('qqq Private key path: ' + EnvVars.Firebase.PrivateKeyPath);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));


if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan((tokens, req, res) => {
      const logMessage = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res) + 'ms',
      ].join(' ');

      if (res.statusCode >= 400) {
        logger.err(logMessage);
      } else {
        logger.info(logMessage); 
      }
      return null;
    }),
  );
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// API docs (Swagger UI). Mounted before the static/catch-all handlers so the
// docs aren't swallowed by the SPA fallback. A relaxed Content-Security-Policy
// is scoped to this path only so Swagger UI's inline bootstrap still runs when
// helmet is enabled in production; the rest of the app keeps helmet's defaults.
app.use(
  Paths.Docs,
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'", 'https:'],
        'img-src': ["'self'", 'data:', 'https:'],
      },
    },
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: 'Karma App API Docs' }),
);

const LOGS_DIR = './'; // Root directory

app.get('/logs', (req, res) => {
  fs.readdir(LOGS_DIR, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading directory');
    }

    // Filter for log files (modify extension if needed)
    const logFiles = files.filter(file => file.endsWith('.log'));

    // Get file creation times
    const fileDetails = logFiles.map(file => {
      const filePath = path.join(LOGS_DIR, file);
      return {
        name: file,
        time: fs.statSync(filePath).birthtime, // Creation time
        content: fs.readFileSync(filePath, 'utf8'), // Read file content
      };
    });

    // Sort by creation time (oldest first)
    fileDetails.sort((a, b) => a.time.getTime() - b.time.getTime());

    // Serve as an HTML page
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


// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  },
);

// ** Front-End Content ** //
const staticDir = path.join(__dirname, '../ui/dist');
app.use(express.static(staticDir));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send('API endpoint not found');
  }
  res.sendFile(path.join(__dirname, '../ui/dist', 'index.html'));
});

// Nav to users pg by default
// app.get('/', (_: Request, res: Response) => {
//   return res.redirect('/users');
// });

// // Redirect to login if not logged in.
// app.get('/users', (_: Request, res: Response) => {
//   return res.sendFile('users.html', { root: viewsDir });
// });

//TODO remove force: true to keep the data on server restart.
//TODO figure out initial data population or migration betweeen production and development
///sequelize.sync({ force: true }).then(() => {
sequelize.sync({ force: true }).then(() => {
  seed();
});


export default app;
