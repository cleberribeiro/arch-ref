import { InjectRepository } from '@nestjs/typeorm';
import { DummyEntity } from 'src/domain/entities/dummy/dummy.entity';
import { Dummy, DummyCreate } from 'src/domain/protocols/dummy/dummy.interface';
import { MongoRepository } from 'typeorm';

export class DummyRepository {
  constructor(
    @InjectRepository(DummyEntity)
    private readonly dummyRepository: MongoRepository<DummyEntity>,
  ) {}

  public async save(data: DummyCreate): Promise<Dummy> {
    return await this.dummyRepository.save(new DummyEntity(data));
  }

}