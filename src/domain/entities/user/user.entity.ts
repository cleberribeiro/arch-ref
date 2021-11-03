import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
  @ObjectIdColumn({ name: 'id' }) id: ObjectID;
  @Column() name: string;
  @Column() email: string;
  @Column() password: string;

  constructor(user?: Partial<UserEntity>) {
    Object.assign(this, user);
  }
}