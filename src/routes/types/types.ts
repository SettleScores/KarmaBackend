import { User } from '@src/db/models/User';
import * as e from 'express';
import { Query } from 'express-serve-static-core';


// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

export type IAuthReq<T = void> = IReq<T> & { user: User} /// має всі поля, які і зліва і справа, і само собою типізоване body
