import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/domain/protocols/user/user.interface';
import { GetAllUserService } from 'src/domain/services/user/get-all-user.service';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

describe('Domain :: Services :: User :: CreateUserService', () => {

  let logger;
  let userRepository;
  let getAllUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GetAllUserService],
      providers: [ 
        {
          provide: Logger,
          useValue: {
            log: jest.fn()
          }
        },
        {
          provide: UserRepository,
          useValue: {
            findAll: jest.fn()
          }
        }
      ],
    }).compile();

    logger = await moduleRef.get<Logger>(Logger);
    userRepository = await moduleRef.get<UserRepository>(UserRepository);
    getAllUserService = await moduleRef.get<GetAllUserService>(GetAllUserService);

  });

  it('should return a list of Users', async () => {

    const mockUserRepository: User[] = [{
      id: '123',
      name: 'Cleber',
      email: 'valid@email.com.br',
      password: 'x12s21f10'
    },
    {
      id: '321',
      name: 'Cleber R',
      email: 'valid123@email.com.br',
      password: 'xdr321'
    }];

    
    jest.spyOn(userRepository, 'findAll').mockResolvedValue(mockUserRepository);
    

    const response = await getAllUserService.findAll();

    expect(response).toEqual(mockUserRepository);

    expect(logger.log).toHaveBeenCalledWith('Call service', 'GetAllUserService.getAll');
    

  });

  it('should return a empty list of Users', async () => {

    const mockUserRepository: User[] = [];

    jest.spyOn(userRepository, 'findAll').mockResolvedValue(mockUserRepository);

    const response = await getAllUserService.findAll();

    expect(response).toEqual([]);

    expect(logger.log).toHaveBeenCalledWith('Call service', 'GetAllUserService.getAll');
    

  });

})