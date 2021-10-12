import { ObjectID } from "typeorm";
export interface Dummy {
  id: ObjectID | string;
  description: string;
}
export interface DummyCreate {
  description: string;
}

export interface DummyUpdate {
  description: string;
}
export interface IDummyCreate {
  create(data: DummyCreate): Promise<Dummy>;
}

export interface IDummyGetAll {
  findAll(): Promise<Dummy[]>;
}

export interface IDummyGetOne {
  findById(id: ObjectID): Promise<Dummy>;
}

export interface IDummyUpdate {
  update(id: ObjectID, data: DummyUpdate): Promise<any>;
}

export interface IDummyRemove {
  remove(id: ObjectID): Promise<any>;
}
