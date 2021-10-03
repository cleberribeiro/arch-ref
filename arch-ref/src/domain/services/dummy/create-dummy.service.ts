import { Injectable } from '@nestjs/common';
import { Dummy, DummyCreate, IDummyCreate } from 'src/domain/protocols/dummy/dummy.interface';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';

@Injectable()
export class CreateDummyService implements IDummyCreate {

  constructor(
    private dummyRepository: DummyRepository
  ) {}

  public async create(data: DummyCreate): Promise<Dummy> {
    return this.dummyRepository.save(data);
  }
}
