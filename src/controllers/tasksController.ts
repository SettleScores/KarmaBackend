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

export const getAllTasks = async (request: IAuthReq, response: IRes) => { /// заместо 
  const { tokenAfterSplit } = extractToken(request);

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

export const uploadTheFile = (request: IAuthReq, response: IRes) => {
  try {
    const { requestAny, tokenAfterSplit } = extractToken(request);

    TaskStatus.destroy({ where: { taskId: requestAny.body.taskId } });

    TaskStatus.create({
      userId: (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id,
      fileName: requestAny.body.filename,
      taskId: requestAny.body.taskId,
      status: 'Pending',
    });

    response.status(200).json({ success: 'file upload successful' });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const creepInTheTask = (request: IAuthReq, response: IRes) => {
  const { requestAny, tokenAfterSplit } = extractToken(request);

  const userId: number = (
    jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any
  ).id;

  TaskStatus.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { taskId: requestAny.body.taskId }],
    },
  }).then((taskStatus) => {
    if (!taskStatus) {
      TaskStatus.create({
        userId: userId,
        fileName: '',
        taskId: requestAny.body.taskId,
        status: 'Working',
      });
    }
    response.status(201).json({ 
      success: `Changed task ${ requestAny.body.taskId} status to \'Working\'`,
      taskId: requestAny.body.taskId, 
    });
  });
};

