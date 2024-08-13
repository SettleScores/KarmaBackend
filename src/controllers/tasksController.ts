import { IAuthReq, IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { Task } from '@src/db/models/Task';
import { TaskStatus } from '@src/db/models/TaskStatus';
import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';


export const getAllTasks = async (request: IAuthReq, response: IRes) => { /// заместо 
  const tasksBunch = await Task.findAll();

  response.status(200).send({
    tasks: tasksBunch,
  });
};

export const uploadTheFile = (request: IAuthReq, response: IRes) => {
  try {
    const token = request.headers.authorization || '' /// subtle nuance; if undefined replace with empty string''
  
    const tokenAfterSplit = token.split(" ")[1];

    const requestAny = request as any /// TODO it would be fino if it was possible to do without 'any'

    TaskStatus.create({
      userId: (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id,
      ///fileName: requestAny.params.filename,
      fileName: requestAny.body.filename,
      taskId: requestAny.body.taskId,
      status: 'Pending',
    });

    response.status(200).json({ success: "file upload successful" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

