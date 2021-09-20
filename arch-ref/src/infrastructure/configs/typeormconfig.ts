import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_CONNECTION_STRING,
  database: process.env.MONGODB_DATABASE,
  entities: [
    __dirname + '/**/*.entity{.ts,.js}',
  ],
  ssl: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
};