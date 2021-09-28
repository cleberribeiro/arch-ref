import { Injectable } from '@nestjs/common';
import { Dummy } from 'src/domain/entities/dummy/dummy';
import { IDummyCreate } from 'src/domain/protocols/dummy/dummy.interface';

@Injectable()
export class CreateDummyService implements IDummyCreate {

  create(data: Dummy) {
    return new Dummy(data.description);
  }
}
