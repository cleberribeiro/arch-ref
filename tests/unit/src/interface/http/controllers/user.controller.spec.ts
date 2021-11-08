import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserEntity } from 'src/domain/entities/user/user.entity';
import { User } from 'src/domain/protocols/user/user.interface';
import { CreateUserService } from 'src/domain/services/user/create-user.service';
import { UserController } from 'src/interface/http/controllers/user.controller';
import { UserCreateDto } from 'src/interface/http/dto/user.dto';

describe('Interface :: http :: controllers :: user :: UserController', () => {
  let userController: UserController;
  let createUserService: CreateUserService;
  let logger: Logger;

  const userMock: User = new UserEntity({
    name: 'Cleber',
    email: 'valid@email.com.br',
    password: 'x12s21f10'
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [ 
        {
          provide: Logger,
          useValue: {
            log: jest.fn()
          }
        },
        {
          provide: CreateUserService,
          useValue: {
            create: jest.fn()
          }
        }
      ],
    }).compile();

    logger = await moduleRef.get<Logger>(Logger);
    userController = await moduleRef.get<UserController>(UserController);
    createUserService = await moduleRef.get<CreateUserService>(CreateUserService);

  });
  describe('createUser', () => {

    it('should User Controller to be defined', async () => { 
      expect(userController).toBeDefined();
      expect(logger).toBeDefined();
      expect(createUserService).toBeDefined();
    });

    it('should throw error', () => { 
      const body: UserCreateDto = {
        name: 'Cleber',
        email: 'valid@email.com.br',
        password: 'x12s21f10'
      };

      jest.spyOn(createUserService, 'create').mockRejectedValueOnce(new Error);

      try {
        expect(userController.createUser(body)).rejects.toThrowError(new InternalServerErrorException('Internal error'));
      } catch(error) {
        expect(logger.log).toHaveBeenCalledTimes(1);
      }

    });

    it('should return user created with success ', async () => { 
      const body: UserCreateDto = {
        name: 'Cleber',
        email: 'valid@email.com.br',
        password: 'x12s21f10'
      };

      jest.spyOn(createUserService, 'create').mockResolvedValue(userMock);

      const result = await userController.createUser(body);

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userMock);

    });

  })

});