import { Injectable, Logger } from '@nestjs/common';
import { DummyUpdate, IDummyUpdate } from 'src/domain/protocols/dummy/dummy.interface';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class UpdateDummyService implements IDummyUpdate {

  constructor(
    private dummyRepository: DummyRepository,
    private logger: Logger
  ) {}

  public async update(id: ObjectID, data: DummyUpdate): Promise<any> {
    this.logger.log('Call service', 'GetAllDummyService.update');
    return this.dummyRepository.update(id, data);
  }
}
