import { Injectable, Logger } from '@nestjs/common';
import { UserUpdate, IUserRemove } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class RemoveUserService implements IUserRemove {

  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  public async remove(id: ObjectID): Promise<any> {
    this.logger.log('Call service', 'GetAllUserService.update');
    return this.userRepository.remove(id);
  }
}
