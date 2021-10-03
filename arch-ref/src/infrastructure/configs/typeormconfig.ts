import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_CONNECTION_STRING,
  entities: [
    __dirname + '../../../../dist/domain/entities/**/*.entity{.ts,.js}',
  ],
  useNewUrlParser: true,
  useUnifiedTopology: true,
};