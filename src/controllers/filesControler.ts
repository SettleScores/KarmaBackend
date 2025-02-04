import { IRes } from '@src/routes/types/express/misc';
import { IAuthReq } from '@src/routes/types/types';
import path from 'path';
import fs from 'fs';

const SAFE_DIRECTORY = path.join(__dirname, '../../uploads');

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