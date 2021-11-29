import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/domain/entities/user/user.entity';
import { User, UserCreate, UserUpdate } from 'src/domain/protocols/user/user.interface';
import { MongoRepository, ObjectID as ObjectIDType } from 'typeorm';
import { ObjectID } from 'mongodb';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly mongoRepository: MongoRepository<UserEntity>,
    private logger: Logger
  ) {}

  public async save(data: UserCreate): Promise<User> {
    const response = await this.mongoRepository.save(new UserEntity(data));
    if (!response) {
      this.logger.log(`Not save User in database [${response}]`, 'UserRepository.save');
      return null;
    }
    this.logger.log(`User created with success`, 'UserRepository.save');
    return response;
  }

  public async findAll(): Promise<User[]> {
    this.logger.log('Call UserRepository', 'UserRepository.getAll');
    return this.mongoRepository.find();
  }

  public async find(conditionals: any): Promise<User[]> {
    this.logger.log('Call UserRepository', 'UserRepository.find');
    return this.mongoRepository.find(conditionals);
  }

  public async findById(id: ObjectIDType): Promise<User> {
    this.logger.log('Call UserRepository', 'UserRepository.findById');
    return await this.mongoRepository.findOneOrFail({ where: { _id: new ObjectID(id) } });
  }

  public async update(id: ObjectIDType, data: UserUpdate): Promise<any> {
    this.logger.log('Call UserRepository', 'UserRepository.update');
    return await this.mongoRepository.updateOne({ _id: new ObjectID(id) }, { $set: data }, { upsert: true } );
  }

  public async partialUpdate(email: string, data: any): Promise<any> {
    this.logger.log('Call UserRepository', 'UserRepository.partialUpdate');
    return await this.mongoRepository.update({ email: email }, data);
  }

  public async remove(id: ObjectIDType): Promise<any> {
    this.logger.log('Call UserRepository', 'UserRepository.remove');
    return await this.mongoRepository.findOneAndDelete({ _id: new ObjectID(id) });
  }

}