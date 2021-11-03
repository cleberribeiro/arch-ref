import { ObjectID } from "typeorm";
export interface User {
  id: ObjectID | string;
  name: string;
  email: string;
  password: string;
}
export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdate {
  name: string;
  email: string;
  password: string;
}
export interface IUserCreate {
  create(data: UserCreate): Promise<User>;
}

export interface IUserGetAll {
  findAll(): Promise<User[]>;
}

export interface IUserGetOne {
  findById(id: ObjectID): Promise<User>;
}

export interface IUserUpdate {
  update(id: ObjectID, data: UserUpdate): Promise<any>;
}

export interface IUserRemove {
  remove(id: ObjectID): Promise<any>;
}
