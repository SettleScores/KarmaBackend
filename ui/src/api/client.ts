import {
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
} from 'material-react-table';
import { Task, TaskStatus,UserApiResponse } from './types.ts';

export const baseUrl = 'https://karmabackend-production.up.railway.app/';

export const login = (username: string | null, password: string | null): Promise<string> => {
    return fetch(`${baseUrl}api/karma/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            usernameOrEmail: username,
            password
        })
    })
        .then(res => res.json())
        .then(res => res.accessToken)
}

export const sendPush = (accessToken: string, username: string | null) => {
    return fetch(`${baseUrl}api/karma/pushpush`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            usernameOrEmail: username, /// TODO Here will be some criteria for push from Adminka
        })

    })
}

export const sendPushForAll = (accessToken: string, title: string | null, body: string | null) => {
    return fetch(`${baseUrl}api/karma/pushpushall`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            title: title,
            body: body,
        })
    })
}

export const getUsers = async (accessToken: string, columnFilters: MRT_ColumnFiltersState, globalFilter: string, sorting: MRT_SortingState, pagination: MRT_PaginationState): Promise<UserApiResponse> => {
    const fetchURL = new URL("api/karma/users", baseUrl);

    //read our state and pass it to the API as query params
    fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
    );
    fetchURL.searchParams.set("size", `${pagination.pageSize}`);
    fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
    fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
    fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

    const response = await fetch(fetchURL, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + accessToken,
        },
    });

    const json = (await response.json()) as UserApiResponse;

    return json;
}

export const getAllTasks = async (accessToken: string): Promise<Task[]> => {
    const response = await fetch(`${baseUrl}api/karma/alltasks`, {
        headers: {
            authorization: "Bearer " + accessToken,
        },
    })

    const json = (await response.json()) as { tasks: Task[] };

    return json.tasks;
}

export const getFile = async (accessToken: string, filename: string): Promise<string> => {
    const response = await fetch(`${baseUrl}api/karma/files/${filename}`, {
        headers: {
            authorization: "Bearer " + accessToken,
        },
    })

    const res = await response.text();
    return res;
}

export const validateTask = async (accessToken: string, taskStatusId: number, approve: boolean, userId: number, reason?: string): Promise<{ id: number, status: TaskStatus["status"] }> => {
    const response = await fetch(`${baseUrl}api/karma/taskstatus/${taskStatusId}/validate`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            approve,
            rejectReason: reason,
            userId: userId
        })
    })

    const { id, status } = await response.json();

    return { id, status };
}

export const getVideoUrl = async (accessToken: string, filename: string): Promise<{ url: string, expireInMiliseconds: number }> => {
    const response = await fetch(`${baseUrl}api/karma/video/${filename}`, {
        headers: {
            authorization: "Bearer " + accessToken,
        },
    })

    const { url, expireInMiliseconds } = await response.json();

    const fullVideoUrl = `${baseUrl}api/karma/stream/${url}`;


    return { url: fullVideoUrl, expireInMiliseconds };
}

