import { IRes } from '@src/routes/types/express/misc';
import { IAuthReq, IReq } from '@src/routes/types/types';
import path from 'path';
import fs from 'fs';

const SAFE_DIRECTORY = path.join(__dirname, '../../uploads');

import { v4 as uuidv4 } from 'uuid';

const tempurls: Record<string, string> = {};

export const getVideoUrl = async (request: IAuthReq, response: IRes) => {
  let filename = request.params.filename;

  if (!filename || typeof filename !== 'string') {
    return response.status(400).send('Filename is required');
  }

  const userRoles = await request.user.getRoles();

  const isAdmin = !!userRoles.find(r => r.name === 'admin');

  if (!isAdmin) return response.status(401).send('Unauthorized');  //TODO if needed for users later, implement it in a way that user may only get his own file

  filename = path.basename(filename);
  const filePath = path.join(SAFE_DIRECTORY, filename);

  if (!filePath.startsWith(SAFE_DIRECTORY)) return response.status(403).send('Access denied');
  if (!fs.existsSync(filePath)) return response.status(404).send('File not found');
  if (!filePath.includes('.mp4')) return response.status(404).send('File not found');

  const videoId = uuidv4();
  tempurls[videoId] = filePath;

  const expireInMiliseconds = 1000 * 60 * 30;

  setTimeout(() => delete tempurls[videoId], expireInMiliseconds);

  response.status(200).send({ url: videoId, expireInMiliseconds });
};

export const streamVideo = (request: IReq, response: IRes) => {
  const id = request.params.id;
  const filePath = tempurls[id];

  if (!filePath) return response.status(404).send('Not found');

  const stat = fs.statSync(filePath);

  response.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
  });

  fs.createReadStream(filePath).pipe(response);
};


export const downloadFile = async (request: IAuthReq, response: IRes) => {
  try {

    let filename = request.params.filename;

    if (!filename || typeof filename !== 'string') {
      return response.status(400).send('Filename is required');
    }

    const userRoles = await request.user.getRoles();

    const isAdmin = !!userRoles.find(r => r.name === 'admin');

    if (!isAdmin) return response.status(401).send('Unauthorized');  //TODO if needed for users later, implement it in a way that user may only get his own file

    filename = path.basename(filename);
    const filePath = path.join(SAFE_DIRECTORY, filename);
    if (!filePath.startsWith(SAFE_DIRECTORY)) {
      return response.status(403).send('Access denied');
    }
    if (!fs.existsSync(filePath)) {
      return response.status(404).send('File not found');
    }

    response.sendFile(filePath);

  } catch (error) {
    response.status(500).json({ error: error });
  }
};