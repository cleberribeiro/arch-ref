import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/domain/entities/user/user.entity';
import { User, UserCreate, UserUpdate } from 'src/domain/protocols/user/user.interface';
import { MongoRepository, ObjectID as ObjectIDType } from 'typeorm';
import { ObjectID } from 'mongodb';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    private logger: Logger
  ) {}

  public async save(data: UserCreate): Promise<User> {
    return await this.userRepository.save(new UserEntity(data));
  }

  public async findAll(): Promise<User[]> {
    this.logger.log('Call UserRepository', 'UserRepository.getAll');
    return this.userRepository.find();
  }

  public async findById(id: ObjectIDType): Promise<User> {
    this.logger.log('Call UserRepository', 'UserRepository.findById');
    return await this.userRepository.findOneOrFail({ where: { _id: new ObjectID(id) } });
  }

  public async update(id: ObjectIDType, data: UserUpdate): Promise<any> {
    this.logger.log('Call UserRepository', 'UserRepository.update');
    return await this.userRepository.updateOne({ _id: new ObjectID(id) }, { $set: data }, { upsert: true } );
  }

  public async remove(id: ObjectIDType): Promise<any> {
    this.logger.log('Call UserRepository', 'UserRepository.remove');
    return await this.userRepository.findOneAndDelete({ _id: new ObjectID(id) });
  }

}