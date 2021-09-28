import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateDummy } from 'src/application/use-cases/create-dummy';
import { Dummy } from 'src/infrastructure/repository/entities/dummy.entity';
import { CreateDummyService } from 'src/domain/services/dummy/create-dummy/create-dummy.service';
import { typeormConfig } from 'src/infrastructure/configs/typeormconfig';
import { DummyController } from 'src/interface/http/controllers/dummy/dummy.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeormConfig),
        TypeOrmModule.forFeature([Dummy]),
      ],
    controllers: [DummyController],
    providers: [
      CreateDummy,
      CreateDummyService
    ],
})
export class DatabaseModule {}