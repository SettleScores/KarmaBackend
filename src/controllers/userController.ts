import { IAuthReq } from "@src/routes/types/types";
import { IRes } from '@src/routes/types/express/misc';
import { User } from '@src/db/models/User';
import { Rank } from '@src/db/models/Rank';
import { Op } from 'sequelize';
import { TaskStatus } from '@src/db/models/TaskStatus';
import jwt from 'jsonwebtoken';
import EnvVars from '@src/constants/EnvVars';


export const getTheUserProfile = async (request: IAuthReq, response: IRes) => {
  const token = request.headers.authorization || '';
  
  const tokenAfterSplit = token.split(' ')[1];

  const foundUser = await User.findOne({
    where: { id: (jwt.verify(tokenAfterSplit, EnvVars.Jwt.Secret) as any).id },
  });

  if (!foundUser) {
    return response.status(404).send({ message: 'User Not found.' });
  }

  const foundUserRank = await Rank.findOne({ where: { id: foundUser.rankId } });

  const foundUserRankName = foundUserRank?.name;

  const workingTasksStatuses = await TaskStatus.findAll({
    where: {
      [Op.and]: [
        { userId: foundUser.id },
        { status: 'Working' },
      ],
    },
  });

  const workingTasksCount = workingTasksStatuses.length

  const pendingTasksStatuses = await TaskStatus.findAll({
    where: {
      [Op.and]: [
        { userId: foundUser.id },
        { status: 'Pending' },
      ],
    },
  });

  const pendingTasksCount = pendingTasksStatuses.length


  const completedTasksCount = await TaskStatus.count({
    where: {
      [Op.and]: [
        { userId: foundUser.id },
        { status: 'Done' },
      ],
    },
  });

  const rejectedTasksCount = await TaskStatus.count({
    where: {
      [Op.and]: [
        { userId: foundUser.id },
        { status: 'Rejected' },
      ],
    },
  });

  return response.status(200).send({ 
    username: foundUser.username,
    rankName: foundUserRankName,
    working: workingTasksCount,
    pending: pendingTasksCount,
    completed: completedTasksCount,
    rejected: rejectedTasksCount,
  });
};