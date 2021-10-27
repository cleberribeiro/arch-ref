import { Injectable, Logger } from '@nestjs/common';
import { DummyUpdate, IDummyRemove } from 'src/domain/protocols/dummy/dummy.interface';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';
import { ObjectID } from 'typeorm';

@Injectable()
export class RemoveDummyService implements IDummyRemove {

  constructor(
    private dummyRepository: DummyRepository,
    private logger: Logger
  ) {}

  public async remove(id: ObjectID): Promise<any> {
    this.logger.log('Call service', 'GetAllDummyService.update');
    return this.dummyRepository.remove(id);
  }
}
