import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const prepareLoader = () => {
  const storage = multer.diskStorage({
    destination: function (request, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (request, file, cb) {
      const randomUuid = uuidv4();

      const dot = '.';

      request.body.filename = randomUuid + dot + file.originalname.split(dot)[1];
      cb(null, randomUuid + dot + file.originalname.split(dot)[1]);
    },
  });

  const upload = multer({ storage: storage });

  return upload.single('file');
};