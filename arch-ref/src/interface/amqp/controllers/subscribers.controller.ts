import {
    Body,
    Controller,
    Post,
    Inject,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
   
  @Controller('subscribers')
  export default class SubscribersController {
    constructor(
      @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
    ) {}
    
    @Post()
    async createPost(@Body() subscriber: any) {
      
      return this.subscribersService.send({
        cmd: 'add-subscriber'
      }, subscriber);

    }
   
  }