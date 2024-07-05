import { IRes } from '@src/routes/types/express/misc';
import { IAuthReq } from '@src/routes/types/types';
import multer from 'multer';

export const upload = (request: IAuthReq, response: IRes) => {
    const storage = multer.diskStorage({
        destination: function(request, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function(req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + file.originalname)
        }
    })

    const upload = multer({ storage: storage })

    upload.single('file')
}