import { Injectable, Logger } from '@nestjs/common';
import { Dummy, IDummyGetAll } from 'src/domain/protocols/dummy/dummy.interface';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';

@Injectable()
export class GetAllDummyService implements IDummyGetAll {

  constructor(
    private dummyRepository: DummyRepository,
    private logger: Logger
  ) {}

  public async findAll(): Promise<Dummy[]> {
    this.logger.log('Call service', 'GetAllDummyService.getAll');
    return this.dummyRepository.findAll();
  }
}
