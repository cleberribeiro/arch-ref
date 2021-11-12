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
import { AmqpModule } from './amqp.module';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';
import { PasswordResetService } from 'src/domain/services/password-reset/password-reset.service';
import { PasswordResetEntity } from 'src/domain/entities/password-reset/password-reset.entity';
import { PasswordResetRepository } from 'src/infrastructure/repository/password-reset.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([UserEntity, PasswordResetEntity]),
    CacheModule.register({
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    AmqpModule
  ],
  controllers: [UserController],
  providers: [
    CreateUserService,
    GetAllUserService,
    GetOneUserService,
    UpdateUserService,
    RemoveUserService,
    UserRepository,
    PasswordResetRepository,
    BcryptService,
    PasswordResetService,
    Logger
  ],
  exports: [
    CreateUserService, 
    GetAllUserService, 
    GetOneUserService, 
    UpdateUserService, 
    RemoveUserService, 
    PasswordResetService,
    PasswordResetRepository,
    UserRepository
  ]
})
export class DatabaseModule { }