import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetEntity } from 'src/domain/entities/password-reset/password-reset.entity';
import { PasswordReset } from 'src/domain/protocols/password-reset/password-reset.interface';
import { MongoRepository } from 'typeorm';


export class PasswordResetRepository {
  constructor(
    @InjectRepository(PasswordResetEntity)
    private readonly _mongoRepository: MongoRepository<PasswordResetEntity>,
    private logger: Logger
  ) {}

  public async save(data: PasswordReset): Promise<PasswordReset> {
    return await this._mongoRepository.save(new PasswordResetEntity(data));
  }

  public async find(conditionals: any): Promise<PasswordReset[]> {
    this.logger.log('Find password reset', 'PasswordResetRepository.find');
    return await this._mongoRepository.find(conditionals);
  }

}