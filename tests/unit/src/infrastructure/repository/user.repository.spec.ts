import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "src/domain/entities/user/user.entity";
import { UserRepository } from "src/infrastructure/repository/user.repository";
import { MongoRepository } from "typeorm";

describe('Infrastructure :: Repository :: UserRepository', () => {
  let mongoRepository;
  let userRepository;
  let logger;

  const repositoryMockFactory: () => MockType<MongoRepository<UserEntity>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
  // ...
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
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory
        }/* ,
        {
          provide: MongoRepository,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneOrFail: jest.fn(),
            updateOne: jest.fn(),
            findOneAndDelete: jest.fn(),
          }
        } */
      ],
    }).compile();

    logger = await moduleRef.get<Logger>(Logger);
    mongoRepository = await moduleRef.get<MongoRepository<UserEntity>>(MongoRepository);
    userRepository = await moduleRef.get<UserRepository>(UserRepository);
  });

  it('should return save entity on mongodb', async () => {

  });

});