import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User, UserCreate, IUserCreate } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';

@Injectable()
export class CreateUserService implements IUserCreate {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userRepository: UserRepository
  ) {}

  public async create(data: UserCreate): Promise<User> {
    const register = await this.userRepository.save(data);
    // if (register.id) {
    //   this.cacheManager.set(String(register.id), register.description, { ttl: 3000 });
    // }
    return register;
  }
}
