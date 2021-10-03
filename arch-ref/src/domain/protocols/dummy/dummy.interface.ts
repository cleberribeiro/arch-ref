import { ObjectID } from "typeorm";
export interface Dummy {
  id: ObjectID;
  description: string;
}
export interface DummyCreate {
  description: string;
}
export interface IDummyCreate {
  create(data: DummyCreate): Promise<Dummy>;
}
