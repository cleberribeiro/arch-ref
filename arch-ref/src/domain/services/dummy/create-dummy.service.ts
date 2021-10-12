import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Dummy, DummyCreate, IDummyCreate } from 'src/domain/protocols/dummy/dummy.interface';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';

@Injectable()
export class CreateDummyService implements IDummyCreate {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private dummyRepository: DummyRepository
  ) {}

  public async create(data: DummyCreate): Promise<Dummy> {
    const register = await this.dummyRepository.save(data);
    if (register.id) {
      this.cacheManager.set(String(register.id), register.description, { ttl: 3000 });
    }
    return register;
  }
}
