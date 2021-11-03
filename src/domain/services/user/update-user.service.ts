import { Injectable, Logger } from '@nestjs/common';
import { UserUpdate, IUserUpdate } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class UpdateUserService implements IUserUpdate {

  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  public async update(id: ObjectID, data: UserUpdate): Promise<any> {
    this.logger.log('Call service', 'GetAllUserService.update');
    return this.userRepository.update(id, data);
  }
}
