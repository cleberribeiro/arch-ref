import { CacheModule, Logger, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/domain/entities/user/user.entity';
import { CreateUserService } from 'src/domain/services/user/create-user.service';
import { GetAllUserService } from 'src/domain/services/user/get-all-user.service';
import { GetOneUserService } from 'src/domain/services/user/get-one-user.service';
import { RemoveUserService } from 'src/domain/services/user/remove-user.service';
import { UpdateUserService } from 'src/domain/services/user/update-user.service';
import { typeormConfig } from 'src/infrastructure/configs/typeormconfig';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { UserController } from 'src/interface/http/controllers/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
    })
  ],
  controllers: [UserController],
  providers: [
    CreateUserService,
    GetAllUserService,
    GetOneUserService,
    UpdateUserService,
    RemoveUserService,
    UserRepository,
    Logger
  ],
  exports: [
    CreateUserService, 
    GetAllUserService, 
    GetOneUserService, 
    UpdateUserService, 
    RemoveUserService, 
    UserRepository
  ]
})
export class DatabaseModule { }