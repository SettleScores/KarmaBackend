import {IReq, IRes} from "@src/routes/types/express/misc";
import { getTasks, getTaskById, createTask } from '../controllers/databaseController';
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

async function createSingleTask(request: IReq, response: IRes) {
    return createTask(request, response);
}

async function getAllTasks(request: IReq, response: IRes) {
    return getTasks(request, response);
}

function answerHelloTasks(request: IReq, response: IRes) {
    return response.status(HttpStatusCodes.OK).json({message: 'Hello Tasks'});
}

export default {
    createSingleTask,
    getAllTasks,
    answerHelloTasks
} as const;
