import { Body, Controller, Get, InternalServerErrorException, Logger, Post } from '@nestjs/common';
import { User } from 'src/domain/protocols/user/user.interface';
import { CreateUserService } from 'src/domain/services/user/create-user.service';
import { UserCreateDto } from '../dto/user.dto';
import { GetAllUserService } from 'src/domain/services/user/get-all-user.service';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private getAllUserService: GetAllUserService,
    private logger: Logger
  ) {}
  
  @Post('/')
  async createUser(@Body() user: UserCreateDto): Promise<User> {
    try {
      this.logger.log('Creating a new User', 'UserController.create');
      return await this.createUserService.create(user);
    } catch (error) {
      this.logger.log('Error creating a new User', 'UserController.create');
      throw new InternalServerErrorException('Internal error');
    }
  }

  @Get('/')
  async getAllUser(): Promise<any> {
    try {
      this.logger.log('Starting Get All User', 'UserController.getAllUser');
      return this.getAllUserService.findAll();
    } catch (error) {
      this.logger.error('Error Get All User', error);
      throw new InternalServerErrorException('Internal error');
    }
  }
}