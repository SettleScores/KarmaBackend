import { IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { Task } from '@src/db/models/Task';

export const getAllTasks = async (request: IReq, response: IRes) => {
  console.log("qqq_tasksController_getAllTasks");

  const tasksBunch = await Task.findAll();
  
  console.log("qqq All tasks:", JSON.stringify(tasksBunch, null, 2));

  response.status(200).send({
    message: "Very good",
    tasks: tasksBunch,
  });
};