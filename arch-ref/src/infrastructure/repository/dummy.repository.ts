import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DummyEntity } from 'src/domain/entities/dummy/dummy.entity';
import { Dummy, DummyCreate, DummyUpdate } from 'src/domain/protocols/dummy/dummy.interface';
import { MongoRepository, ObjectID as ObjectIDType } from 'typeorm';
import { ObjectID } from 'mongodb';

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

  public async findById(id: ObjectIDType): Promise<Dummy> {
    this.logger.log('Call DummyRepository', 'DummyRepository.findById');
    return await this.dummyRepository.findOneOrFail({ where: { _id: new ObjectID(id) } });
  }

  public async update(id: ObjectIDType, data: DummyUpdate): Promise<any> {
    this.logger.log('Call DummyRepository', 'DummyRepository.update');
    return await this.dummyRepository.updateOne({ _id: new ObjectID(id) }, { $set: data }, { upsert: true } );
  }

  public async remove(id: ObjectIDType): Promise<Dummy> {
    this.logger.log('Call DummyRepository', 'DummyRepository.findById');
    return await this.dummyRepository.findOneOrFail({ where: { _id: new ObjectID(id) } });
  }

}