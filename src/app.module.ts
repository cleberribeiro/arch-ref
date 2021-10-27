
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { AmqpModule } from './modules/amqp.module';
import { SubscriberController } from './interface/amqp/inbound/controllers/subscribers.controller';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AmqpModule
  ],
  controllers: [SubscriberController],
  providers: [],
})
export class AppModule {}
