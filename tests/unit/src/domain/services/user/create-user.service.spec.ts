import { CACHE_MANAGER } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserCreate } from 'src/domain/protocols/user/user.interface';
import { CreateUserService } from 'src/domain/services/user/create-user.service';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

describe('Domain :: Services :: User :: CreateUserService', () => {

  let cacheManager;
  let userRepository;
  let bcryptService;
  let createUserService;
  let publisherService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserService],
      providers: [ 
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          }
        },
        {
          provide: 'AMQP_SERVICE',
          useValue: {
            send: jest.fn()
          }
        },
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn()
          }
        },
        {
          provide: BcryptService,
          useValue: {
            hash: jest.fn()
          }
        }
      ],
    }).compile();

    cacheManager = await moduleRef.get<Cache>(CACHE_MANAGER);
    publisherService = await moduleRef.get<ClientProxy>('AMQP_SERVICE');
    userRepository = await moduleRef.get<UserRepository>(UserRepository);
    bcryptService = await moduleRef.get<BcryptService>(BcryptService);
    createUserService = await moduleRef.get<CreateUserService>(CreateUserService);

  });

  it('should return new User if success and save in cache and send to queue', async () => {

    const mockUserRepository: User = {
      id: '123',
      name: 'Cleber',
      email: 'valid@email.com.br',
      password: 'x12s21f10'
    };

    const user: UserCreate = {
      name: 'Cleber',
      email: 'valid@email.com.br',
      password: 'x12s21f10'
    };
    
    jest.spyOn(bcryptService, 'hash').mockResolvedValue('hash_password');
    
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUserRepository);

    jest.spyOn(publisherService, 'send').mockReturnValue({ subscribe: () => {} })

    const response = await createUserService.create(user);

    expect(response).toEqual(mockUserRepository);

    expect(cacheManager.set).toHaveBeenCalledWith('valid@email.com.br', mockUserRepository);
    expect(publisherService.send).toHaveBeenCalledWith({ cmd: 'add-user' }, { data: mockUserRepository });

  });

  it('should throw error User already exists', async () => {
    const mockUserRepository: User = {
      id: '123',
      name: 'Cleber',
      email: 'valid@email.com.br',
      password: 'x12s21f10'
    };

    const user: UserCreate = {
      name: 'Cleber',
      email: 'valid@email.com.br',
      password: 'x12s21f10'
    };
    
    jest.spyOn(cacheManager, 'get').mockResolvedValue(mockUserRepository);
    
    try {
      expect(await createUserService.create(user)).toThrowError('User already exists');
    } catch(error) {
      expect(error).toEqual(Error('User already exists'));
    }
    

  });

})