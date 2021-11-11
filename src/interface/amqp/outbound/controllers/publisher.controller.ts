import {
    Body,
    Controller,
    Post,
    Inject,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
   
  @Controller('publisher')
  export default class PublisherController {
    constructor(
      @Inject('AMQP_USERS_SERVICE') private publisherService: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
      await this.publisherService.connect();
    }
    
    @Post()
    async createPost(@Body() subscriber: any) {
      this.publisherService.send<any>({ cmd: 'add-dummy' }, { subscriber }).subscribe();
      return;

    }
   
  }