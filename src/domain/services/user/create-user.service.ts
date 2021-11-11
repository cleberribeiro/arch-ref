import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { User, UserCreate, IUserCreate } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

@Injectable()
export class CreateUserService implements IUserCreate {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('AMQP_USERS_SERVICE') private publisherService: ClientProxy,
    private userRepository: UserRepository,
    private bcryptService: BcryptService
  ) {}

  public async create(data: UserCreate): Promise<User | any> {

    const userExist = await this.userRepository.find({ email: data.email });

    if (userExist.length > 0) {
      return { message: 'User already exists in database', status: 400 };
    }

    data.password = await this.bcryptService.hash(data.password);

    const user = await this.userRepository.save(data);

    if (user.id) {
      await this.cacheManager.set(user.email, user, { ttl: 0 });
      this.publisherService.send<any>({ cmd: 'add-user' }, { data: user }).subscribe();
    }

    return user;
  }
}
