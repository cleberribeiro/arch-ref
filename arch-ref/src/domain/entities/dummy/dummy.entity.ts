import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('dummy')
export class DummyEntity {
  @ObjectIdColumn() id: ObjectID;
  @Column() description: string;

  constructor(dummy?: Partial<DummyEntity>) {
    Object.assign(this, dummy);
  }
}