import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import PublisherController from 'src/interface/amqp/outbound/controllers/publisher.controller';
 
@Module({
  imports: [ConfigModule],
  controllers: [PublisherController],
  providers: [
    {
      provide: 'AMQP_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueName = configService.get('RABBITMQ_QUEUE_NAME');
 
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            noAck: false,
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      inject: [ConfigService],
    }
  ],
  exports: [
    'AMQP_SERVICE'
  ]
})
export class AmqpModule {}