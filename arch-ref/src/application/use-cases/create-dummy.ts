import { InjectRepository } from '@nestjs/typeorm';
import { Dummy } from 'src/domain/entities/dummy/dummy';
import { CreateDummyService } from 'src/domain/services/dummy/create-dummy/create-dummy.service';
import { MongoRepository } from 'typeorm';

export class CreateDummy {
  constructor(
    @InjectRepository(Dummy)
    private readonly dummyRepository: MongoRepository<Dummy>,
    private createDummySevice: CreateDummyService,
  ) {}

  async execute(data: Dummy) {
    const dummy = this.createDummySevice.create(data);
    return await this.dummyRepository.save(dummy);
  }

}