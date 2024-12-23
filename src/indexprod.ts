import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/constants/EnvVars';
import server from './server';

import https from 'https';
import fs from 'fs';

// Load the self-signed certificate
const options = {
  key: fs.readFileSync('selfsigned.key'),
  cert: fs.readFileSync('selfsigned.crt'),
};

// HTTPS server
const serverprod = https.createServer(options, server);
// **** Run **** //

const SERVER_START_MSG = ('Express server started on port: ' +
    EnvVars.Port.toString());

serverprod.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
