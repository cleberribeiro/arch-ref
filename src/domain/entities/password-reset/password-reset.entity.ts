import { Entity, Column, PrimaryColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity('password-reset')
export class PasswordResetEntity {
  @ObjectIdColumn() id: ObjectID;
  @PrimaryColumn() uuid: string;
  @Column() link: string;
  @Column() email: string;
  @Column() expireIn: string;

  constructor(passwordReset?: Partial<PasswordResetEntity>) {
    Object.assign(this, passwordReset);
  }
}