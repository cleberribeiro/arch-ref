import { Injectable, Logger } from '@nestjs/common';
import { User, IUserGetAll } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';

@Injectable()
export class GetAllUserService implements IUserGetAll {

  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  public async findAll(): Promise<User[]> {
    this.logger.log('Call service', 'GetAllUserService.getAll');
    return this.userRepository.findAll();
  }
}
