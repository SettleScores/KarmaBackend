export type UserApiResponse = {
    data: Array<User>;
    cunt: number;
};

export type User = {
    id: number;
    fullName: string;
    email: string;
    gender: string;
    username: string;
    password: string;
    rankId: number;
    createdAt: string;
    updatedAt: string;
    tasks: TaskStatus[];
};

export type TaskStatus = {
    id: number;
    userId: number;
    taskId: number;
    fileName: string;
    status: 'Unknown'| 'Working'| 'Pending'| 'Done';
    createdAt: string;
    updatedAt: string;
}

export type Task = {
    id: number;
    description: string;
}