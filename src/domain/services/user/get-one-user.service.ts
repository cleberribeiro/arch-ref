import { Injectable, Logger } from '@nestjs/common';
import { User, IUserGetOne } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class GetOneUserService implements IUserGetOne {

  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  public async findById(id: ObjectID): Promise<User> {
    this.logger.log('Call service', 'GetOneUserService.findById');
    return this.userRepository.findById(id);
  }
}
