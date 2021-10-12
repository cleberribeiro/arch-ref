import { Body, Controller, Get, InternalServerErrorException, Logger, Param, Post, Put } from '@nestjs/common';
import { Dummy, DummyUpdate } from 'src/domain/protocols/dummy/dummy.interface';
import { CreateDummyService } from 'src/domain/services/dummy/create-dummy.service';
import { GetAllDummyService } from 'src/domain/services/dummy/get-all-dummy.service';
import { GetOneDummyService } from 'src/domain/services/dummy/get-one-dummy.service';
import { UpdateDummyService } from 'src/domain/services/dummy/update-dummy.service';
import { ParseObjectIdPipe } from 'src/domain/validators/pipe/parse-object-id.pipe';
import { ObjectID } from 'typeorm';
import { DummyCreateDto } from '../../dto/dummy.dto';

@Controller('dummy')
export class DummyController {
  constructor(
    private createDummyService: CreateDummyService,
    private getAllDummyService: GetAllDummyService,
    private getOneDummyService: GetOneDummyService,
    private updateDummyService: UpdateDummyService,
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

  @Get('/')
  async getAllDummy(): Promise<any> {
    try {
      this.logger.log('Starting Get All Dummy', 'DummyController.getAllDummy');
      return this.getAllDummyService.findAll();
    } catch (error) {
      this.logger.error('Error Get All Dummy', error);
      throw new InternalServerErrorException('Internal error');
    }
  }

  @Get('/:id')
  async findById(@Param('id') id: ObjectID): Promise<Dummy> {
    try {
      this.logger.log('Starting Get All Dummy', 'DummyController.getAllDummy');
      return await this.getOneDummyService.findById(id);
    } catch (error) {
      this.logger.error('Error Get All Dummy', error);
      throw new InternalServerErrorException('Internal error');
    }
  }

  @Put('/:id')
  async update(@Param('id') id: ObjectID, @Body() data: DummyUpdate): Promise<Dummy> {
    try {
      this.logger.log('Starting Update Dummy', 'DummyController.update');
      return await this.updateDummyService.update(id, data);
    } catch (error) {
      this.logger.error('Error Update Dummy', error);
      throw new InternalServerErrorException('Internal error');
    }
  }
}
