import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/domain/protocols/user/user.interface';
import { GetOneUserService } from 'src/domain/services/user/get-one-user.service';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { ObjectID } from 'typeorm';


describe('Domain :: Services :: User :: GetOneUserService', () => {

  let logger;
  let userRepository;
  let getOneUserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [GetOneUserService],
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
            findById: jest.fn()
          }
        }
      ],
    }).compile();

    logger = await moduleRef.get<Logger>(Logger);
    userRepository = await moduleRef.get<UserRepository>(UserRepository);
    getOneUserService = await moduleRef.get<GetOneUserService>(GetOneUserService);

  });

  it('should return a Users', async () => {

    const id = '321';

    const mockUserRepository: User = {
      id: '321',
      name: 'Cleber R',
      email: 'valid123@email.com.br',
      password: 'xdr321'
    };

    
    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUserRepository);
    

    const response = await getOneUserService.findById(id);

    expect(response).toEqual(mockUserRepository);

    expect(logger.log).toHaveBeenCalledWith('Call service', 'GetOneUserService.findById');
    

  });

  it('should not return a Users', async () => {

    const id = '123';

    const mockUserRepository: User = {
      id: '321',
      name: 'Cleber R',
      email: 'valid123@email.com.br',
      password: 'xdr321'
    };

    
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);
    

    const response = await getOneUserService.findById(id);

    expect(response).toBeNull();

    expect(logger.log).toHaveBeenCalledWith('Call service', 'GetOneUserService.findById');
    

  });

})