import { Dummy } from 'src/domain/entities/dummy/dummy';

export interface IDummyCreate {
  create(data: Dummy): Dummy;
}
