import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DummyEntity } from 'src/domain/entities/dummy/dummy.entity';
import { Dummy, DummyCreate } from 'src/domain/protocols/dummy/dummy.interface';
import { MongoRepository } from 'typeorm';
import { databaseMapper } from './mappers/database.mapper';

export class DummyRepository {
  constructor(
    @InjectRepository(DummyEntity)
    private readonly dummyRepository: MongoRepository<DummyEntity>,
    private logger: Logger
  ) {}

  public async save(data: DummyCreate): Promise<Dummy> {
    return await this.dummyRepository.save(new DummyEntity(data));
  }

  public async findAll(): Promise<Dummy[]> {
    this.logger.log('Call DummyRepository', 'DummyRepository.getAll');
    return this.dummyRepository.find();
  }

}