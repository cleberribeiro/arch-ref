import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class SubscriberController {
  constructor() {}

  @MessagePattern({ cmd: 'add-dummy' })
  async getAddDummy(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      const channel = context.getChannelRef();
      const originalMsg = context.getMessage();
      channel.ack(originalMsg);
      console.log(`Pattern: ${context.getPattern()}`);
    } catch (error) {
      console.log('ERROR ', error);
    }
    
  }
}