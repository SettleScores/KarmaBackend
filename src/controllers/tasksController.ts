import { IAuthReq, IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { Task } from '@src/db/models/Task';
import { TaskStatus } from '@src/db/models/TaskStatus';
import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { extractToken } from '@src/util/generateToken';


export interface CreepInTaskRequest { /// TODO Use that; and avoid 'any' in creepInTheTask
  taskId: number;
}


export const getLiterallyAllTasks = async (request: IAuthReq, response: IRes) => {
  const { tokenAfterSplit } = extractToken(request);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id;

  //TODO check if user is admin
  console.log(`${userId} is requesting all the tasks`);

  const result = await Task.findAll();

  response.status(200).send({
    tasks: result,
  });
}

export const getAllTasks = async (request: IAuthReq, response: IRes) => { /// заместо 
  const { tokenAfterSplit } = extractToken(request);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const userId = (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id

  const literal = `(SELECT DISTINCT \"taskId\" FROM tasks_statuses WHERE \"userId\" = ${userId})`

  const tasksBunch = await Task.findAll({
    where: {
      id: {
        [Op.notIn]: Sequelize.literal(
          literal
        )
      }
    }
  });

  response.status(200).send({
    tasks: tasksBunch,
  });
};

export const uploadTheFile = (request: IAuthReq<{taskId: number, filename: string}>, response: IRes) => {
  try {
    const { tokenAfterSplit } = extractToken(request);

    TaskStatus.destroy({ where: { taskId: request.body.taskId } });

    TaskStatus.create({
      userId: (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id,
      fileName: request.body.filename,
      taskId: request.body.taskId,
      status: 'Pending',
    });

    response.status(200).json({ success: 'file upload successful' });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const creepInTheTask = (request: IAuthReq<{taskId: number}>, response: IRes) => {
  const { tokenAfterSplit } = extractToken(request);

  const userId: number = (
    jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any
  ).id;

  TaskStatus.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { taskId: request.body.taskId }],
    },
  }).then((taskStatus) => {
    if (!taskStatus) {
      TaskStatus.create({
        userId: userId,
        fileName: '',
        taskId: request.body.taskId,
        status: 'Working',
      });
    }
    response.status(201).json({
      success: `Changed task ${request.body.taskId} status to \'Working\'`,
      taskId: request.body.taskId,
    });
  });
};

