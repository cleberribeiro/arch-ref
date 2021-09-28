import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('dummy')
export class Dummy {
  @ObjectIdColumn() id: ObjectID;
  @Column() description: string;

  constructor(dummy?: Partial<Dummy>) {
    Object.assign(this, dummy);
  }
}