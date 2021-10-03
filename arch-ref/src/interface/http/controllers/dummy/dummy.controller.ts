import { Body, Controller, InternalServerErrorException, Logger, Post } from '@nestjs/common';
import { Dummy } from 'src/domain/protocols/dummy/dummy.interface';
import { CreateDummyService } from 'src/domain/services/dummy/create-dummy.service';
import { DummyCreateDto } from '../../dto/dummy.dto';

@Controller('dummy')
export class DummyController {
  constructor(
    private createDummyService: CreateDummyService,
    private logger: Logger
  ) {}
  
  @Post('/')
  async createDummy(@Body() dummy: DummyCreateDto): Promise<Dummy> {
    try {
      this.logger.log('Creating a new Dummy', 'DummyController.create');
      return await this.createDummyService.create(dummy);
    } catch (error) {
      throw new InternalServerErrorException('Internal error');
    }
  }
}
