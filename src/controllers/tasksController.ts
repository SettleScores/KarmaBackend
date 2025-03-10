/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAuthReq, IReq } from '@src/routes/types/types';
import { IRes } from '@src/routes/types/express/misc';
import { Task } from '@src/db/models/Task';
import { TaskStatus } from '@src/db/models/TaskStatus';
import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { extractToken } from '@src/util/generateToken';
import { PushToken } from '@src/db/models/PushToken';
import { getMessaging } from 'firebase-admin/messaging';
import logger from 'jet-logger';

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

export const uploadTheFile = (request: IAuthReq<{ taskId: number, filename: string }>, response: IRes) => {
  try {
    TaskStatus.destroy({ where: { taskId: request.body.taskId } });

    TaskStatus.create({
      userId: request.user.id,
      fileName: request.body.filename,
      taskId: request.body.taskId,
      status: 'Pending',
    });

    response.status(200).json({ success: 'file upload successful' });
  } catch (error) {
    response.status(500).json({ error: error });
  }
};

export const validateTask = (request: IAuthReq<{ approve: boolean; rejectReason?: string }>, response: IRes) => {
  const id = request.params.id;
  const approve = request.body.approve;
  const reason = request.body.rejectReason;
  const newStatus = approve ? 'Done' : 'Rejected'

  if (!Number.isInteger(Number(id))) {
    return response.status(401).send('Invalid id value');
  }

  TaskStatus.update({
    status: newStatus,
    rejectReason: request.body.rejectReason,
  }, {
    where: {
      id: id,
    },
    returning: true,
  }).then(([_, obj]) => {
    logger.info('Task status for user ' + request.user.id + ' updated: ' + newStatus)

    response.status(200).send(obj[0]);

    logger.info('Looking for a push token');

    PushToken.findOne({
      where: {
        userId: request.user.id,
      },
    }).then(token => {
      const devicePushToken = token?.dataValues.token;

      logger.info('The token is: ' + devicePushToken);

      if (!devicePushToken) return;

      const message = {
        notification: {
          title: 'Your task is ' + (approve ? 'approved' : 'rejected'),
          body: approve ? 'Keep it up!' : reason,
        },
        token: devicePushToken,
      };

      logger.info('Sending the message: ________' + JSON.stringify(message));

      getMessaging().send(message);
    }).catch(err => logger.err(err));
  }).catch(err => {
    response.status(500).send(err);
  });
};

export const creepInTheTask = (request: IAuthReq<{ taskId: number }>, response: IRes) => {
  const userId = request.user.id;

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
      success: `Changed task ${request.body.taskId} status to 'Working'`,
      taskId: request.body.taskId,
    });
  });
};

