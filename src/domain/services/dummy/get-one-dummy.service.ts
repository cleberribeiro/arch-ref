import { Injectable, Logger } from '@nestjs/common';
import { Dummy, IDummyGetOne } from 'src/domain/protocols/dummy/dummy.interface';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class GetOneDummyService implements IDummyGetOne {

  constructor(
    private dummyRepository: DummyRepository,
    private logger: Logger
  ) {}

  public async findById(id: ObjectID): Promise<Dummy> {
    this.logger.log('Call service', 'GetAllDummyService.findById');
    return this.dummyRepository.findById(id);
  }
}
