import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { UserCreate } from "src/domain/protocols/user/user.interface";
import { UserRepository } from "src/infrastructure/repository/user.repository";
import { MongoRepository } from "typeorm";

class MockMongoRepository<T> {}

describe('Infrastructure :: Repository :: UserRepository', () => {
  let mongoRepository;
  let userRepository;
  let logger;

  const repositoryMockFactory: () => MockMongoRepository<MongoRepository<UserEntity>> = jest.fn(() => ({
    save: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    findOneOrFail: jest.fn(entity => entity),
    updateOne: jest.fn(entity => entity),
    update: jest.fn(entity => entity),
    findOneAndDelete: jest.fn(entity => entity),

  }));

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserRepository],
      providers: [
        {
          provide: Logger,
          useValue: {
            log: jest.fn()
          }
        },
        /* {
          provide: getRepositoryToken(UserEntity),
          useValue: repositoryMockFactory
        }, */
        {
          provide: MongoRepository,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneOrFail: jest.fn(),
            updateOne: jest.fn(),
            findOneAndDelete: jest.fn(),
          }
        }
      ],
    }).compile();

    logger = await moduleRef.get<Logger>(Logger);
    mongoRepository = await moduleRef.get<MongoRepository<UserEntity>>(MongoRepository);
    userRepository = await moduleRef.get<UserRepository>(UserRepository);
  });

  describe('save', () => {

    it('should return save entity on mongodb', async () => {
      
      const data: UserCreate = {
        name: 'some_name',
        email: 'some_email@email.com',
        password: 'some_password'
      };

      const spyMongoRepository = jest.spyOn(mongoRepository, 'save').mockResolvedValue(entity => entity);

      const response = await userRepository.save(data);

    });

  });


});