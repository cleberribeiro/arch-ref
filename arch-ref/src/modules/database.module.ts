import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DummyEntity } from 'src/domain/entities/dummy/dummy.entity';
import { CreateDummyService } from 'src/domain/services/dummy/create-dummy.service';
import { GetAllDummyService } from 'src/domain/services/dummy/get-all-dummy.service';
import { typeormConfig } from 'src/infrastructure/configs/typeormconfig';
import { DummyRepository } from 'src/infrastructure/repository/dummy.repository';
import { DummyController } from 'src/interface/http/controllers/dummy/dummy.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeormConfig),
        TypeOrmModule.forFeature([DummyEntity]),
      ],
    controllers: [DummyController],
    providers: [
      CreateDummyService,
      GetAllDummyService,
      DummyRepository,
      Logger
    ],
})
export class DatabaseModule {}