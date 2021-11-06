import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { User, UserCreate, IUserCreate } from 'src/domain/protocols/user/user.interface';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

@Injectable()
export class CreateUserService implements IUserCreate {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userRepository: UserRepository,
    private bcryptService: BcryptService
  ) {}

  public async create(data: UserCreate): Promise<User> {

    data.password = await this.bcryptService.hash(data.password);

    const user = await this.userRepository.save(data);
    if (user.id) {
      this.cacheManager.set(String(user.id), user);
    }
    return user;
  }
}
