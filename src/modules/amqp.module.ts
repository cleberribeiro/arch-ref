import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import PublisherController from 'src/interface/amqp/outbound/controllers/publisher.controller';
 
@Module({
  imports: [ConfigModule],
  controllers: [PublisherController],
  providers: [
    {
      provide: 'AMQP_USERS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueUsers = configService.get('RABBITMQ_QUEUE_USERS');
 
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            noAck: false,
            queue: queueUsers,
            queueOptions: {
              durable: true,
            },
          },
        })
      },
      inject: [ConfigService],
    },
    {
      provide: 'AMQP_NOTIFICATION_SERVICE',
      useFactory: (configService: ConfigService) => {
        const user = configService.get('RABBITMQ_USER');
        const password = configService.get('RABBITMQ_PASSWORD');
        const host = configService.get('RABBITMQ_HOST');
        const queueNotification = configService.get('RABBITMQ_QUEUE_NOTIFICATION');
 
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            noAck: false,
            queue: queueNotification,
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
    'AMQP_USERS_SERVICE',
    'AMQP_NOTIFICATION_SERVICE'
  ]
})
export class AmqpModule {}