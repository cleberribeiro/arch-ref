import { CacheModule, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DummyEntity } from 'src/domain/entities/dummy/dummy.entity';
import { CreateDummyService } from 'src/domain/services/dummy/create-dummy.service';
import { GetAllDummyService } from 'src/domain/services/dummy/get-all-dummy.service';
import { GetOneDummyService } from 'src/domain/services/dummy/get-one-dummy.service';
import { RemoveDummyService } from 'src/domain/services/dummy/remove-dummy.service';
import { UpdateDummyService } from 'src/domain/services/dummy/update-dummy.service';
import { typeormConfig } from 'src/infrastructure/configs/typeormconfig';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';
import { DummyController } from 'src/interface/http/controllers/dummy/dummy.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeormConfig),
        TypeOrmModule.forFeature([DummyEntity]),
        CacheModule.register({
          store: redisStore,
          host: 'redis',
          port: 6379,
        })
      ],
    controllers: [DummyController],
    providers: [
      CreateDummyService,
      GetAllDummyService,
      GetOneDummyService,
      UpdateDummyService,
      RemoveDummyService,
      DummyRepository,
      Logger
    ],
})
export class DatabaseModule {}