import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing/testing-module';
import { UserEntity } from 'src/domain/entities/user/user.entity';
import { User } from 'src/domain/protocols/user/user.interface';
import { PasswordResetService } from 'src/domain/services/password-reset/password-reset.service';
import { CreateUserService } from 'src/domain/services/user/create-user.service';
import { GetAllUserService } from 'src/domain/services/user/get-all-user.service';
import { GetOneUserService } from 'src/domain/services/user/get-one-user.service';
import { UserController } from 'src/interface/http/controllers/user.controller';
import { UserCreateDto } from 'src/interface/http/dto/user.dto';
import { ObjectID } from 'mongodb';
import { PasswordResetDto } from 'src/interface/http/dto/password-reset.dto';
import { PasswordDto } from 'src/interface/http/dto/password.dto';

describe('Interface :: http :: controllers :: user :: UserController', () => {
  let userController: UserController;
  let createUserService: CreateUserService;
  let getAllUserService: GetAllUserService;
  let getOneUserService: GetOneUserService;
  let passwordResetService: PasswordResetService;
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
        },
        {
          provide: GetAllUserService,
          useValue: {
            findAll: jest.fn()
          }
        },
        {
          provide: GetOneUserService,
          useValue: {
            findById: jest.fn()
          }
        },
        {
          provide: PasswordResetService,
          useValue: {
            execute: jest.fn(),
            changePassword: jest.fn()
          }
        }
      ],
    }).compile();

    logger = await moduleRef.get<Logger>(Logger);
    userController = await moduleRef.get<UserController>(UserController);
    createUserService = await moduleRef.get<CreateUserService>(CreateUserService);
    getAllUserService = await moduleRef.get<GetAllUserService>(GetAllUserService);
    getOneUserService = await moduleRef.get<GetOneUserService>(GetOneUserService);
    passwordResetService = await moduleRef.get<PasswordResetService>(PasswordResetService);

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

  });

  describe('getAllUser', () => {

    it('should return an array of Users', async () => {
      const mockUser: User[] = [
        {
          email: 'email1@email.com',
          name: 'John',
          password: '987qwert',
          id: '001'
        },
        {
          email: 'email2@email.com',
          name: 'Mary Jane',
          password: '654qwert',
          id: '002'
        }
      ];

      jest.spyOn(getAllUserService, 'findAll').mockResolvedValue(mockUser);

      const result = await userController.getAllUser();

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          email: expect.any(String),
          name: expect.any(String),
          password: expect.any(String),
          id: expect.any(String),
        })
      ]));
    });

    it('should return an empty array of Users', async () => {
      const mockUser: User[] = [];

      jest.spyOn(getAllUserService, 'findAll').mockResolvedValue(mockUser);

      const result = await userController.getAllUser();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {

    it('should return an User when provide id', async () => {

      const id: ObjectID = new ObjectID('615ce675cb9f050029a5fcff');
      
      const mockUser: User = {
        email: 'email1@email.com',
        name: 'John',
        password: '987qwert',
        id: '001'
      };

      jest.spyOn(getOneUserService, 'findById').mockResolvedValue(mockUser);

      const result = await userController.findById(id);

      expect(result).not.toBeNull();
    });

    it('should return null when user not find in database', async () => {

      const id: ObjectID = new ObjectID('615ce675cb9f050029a5fcff');

      jest.spyOn(getOneUserService, 'findById').mockResolvedValue(null);

      const result = await userController.findById(id);

      expect(result).toBeNull();
    });

    

  });

  describe('passwordReset', () => {
    it('should invoke method execute by PasswordResetService', async () => {
      const mockResetPasswordBody: PasswordResetDto = {
        email: 'email@email.com.br'
      };

      const spyPasswordReset = jest.spyOn(passwordResetService, 'execute').mockResolvedValue(true);
      await userController.passwordReset(mockResetPasswordBody);

      expect(spyPasswordReset).toHaveBeenCalledWith(mockResetPasswordBody.email);
    });
  });

  describe('passwordResetConfirm', () => {
    it('should invoke method changePassword by PasswordResetService', async () => {
      const mockResetPasswordBody: PasswordDto = {
        password: 'new_password'
      };
      const param: any = {
        uuid: 'qwe-123-asd-456'
      }

      const spyPasswordReset = jest.spyOn(passwordResetService, 'changePassword');
      await userController.passwordResetConfirm(mockResetPasswordBody, param);

      expect(spyPasswordReset).toHaveBeenCalledWith(param.uuid, mockResetPasswordBody.password);
    });
  });

});