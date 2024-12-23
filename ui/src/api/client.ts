import {
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
  } from 'material-react-table';
import { type UserApiResponse } from "../components/Users/Users.ts";

const baseUrl = 'http://localhost:3000/'

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