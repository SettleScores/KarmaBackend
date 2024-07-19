import { IAuthReq, IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { Task } from '@src/db/models/Task';


export const getAllTasks = async (request: IAuthReq, response: IRes) => { /// заместо 
  const tasksBunch = await Task.findAll();

  response.status(200).send({
    tasks: tasksBunch,
  });
};

export const uploadTheFile = (request: IAuthReq, response: IRes) => {
  try {
    response.status(200).json({ success: "file upload successful" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

