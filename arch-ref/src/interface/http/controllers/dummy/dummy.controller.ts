import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateDummy } from 'src/application/use-cases/create-dummy';
import { Dummy } from 'src/domain/entities/dummy/dummy';

@Controller('dummy')
export class DummyController {
  constructor(
    private ucCreateDummy: CreateDummy
  ) {}
  
  @Post('dummy')
  async createDummy(@Body() dummy: Partial<Dummy>): Promise<Dummy> {
    if (!dummy || !dummy.description) {
      throw new BadRequestException(`A Dummy must have at least description defined`);
    }
    return await this.ucCreateDummy.execute(dummy);
  }
}
