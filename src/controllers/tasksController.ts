import { IAuthReq, IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { Task } from '@src/db/models/Task';


export const getAllTasks = async (request: IAuthReq, response: IRes) => { /// заместо 
  const tasksBunch = await Task.findAll();

  console.log("qqq request.user:", request.user);

  response.status(200).send({
    tasks: tasksBunch,
  });
};