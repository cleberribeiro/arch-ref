import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectID } from 'typeorm';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any): ObjectID {
    if (!ObjectID.isValid(value)) {
      throw new BadRequestException(`Invalid id ${value}`);
    }

    return ObjectID.createFromHexString(value);
  }
}
