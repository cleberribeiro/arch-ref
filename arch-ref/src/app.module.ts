
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database.module';
import { SubscribersModule } from './modules/subscribes.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SubscribersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
