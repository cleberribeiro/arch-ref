import { Body, Controller, Get, InternalServerErrorException, Logger, Param, Post } from '@nestjs/common';
import { User } from 'src/domain/protocols/user/user.interface';
import { CreateUserService } from 'src/domain/services/user/create-user.service';
import { UserCreateDto } from '../dto/user.dto';
import { GetAllUserService } from 'src/domain/services/user/get-all-user.service';
import { GetOneUserService } from 'src/domain/services/user/get-one-user.service';
import { ObjectID } from 'typeorm';
import { PasswordResetDto } from '../dto/password-reset.dto';
import { PasswordResetService } from 'src/domain/services/password-reset/password-reset.service';
import { PasswordDto } from '../dto/password.dto';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private getAllUserService: GetAllUserService,
    private getOneUserService: GetOneUserService,
    private passwordResetService: PasswordResetService,
    private logger: Logger
  ) {}
  
  @Post('/')
  async createUser(@Body() user: UserCreateDto): Promise<User> {
    try {
      this.logger.log('Creating a new User', 'UserController.create');
      return await this.createUserService.create(user);
    } catch (error) {
      this.logger.log(`Error creating a new User', 'UserController.create`);
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

  @Get('/:id')
  async findById(@Param('id') id: ObjectID): Promise<User> {
    try {
      this.logger.log('Starting Get All User', 'UserController.getAllUser');
      return await this.getOneUserService.findById(id);
    } catch (error) {
      this.logger.error('Error Get All User', error);
      throw new InternalServerErrorException('Internal error');
    }
  }

  @Post('/password/reset')
  async passwordReset(@Body() body: PasswordResetDto): Promise<void> {
    try {
      await this.passwordResetService.execute(body.email)
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/password/reset/:uuid')
  async passwordResetConfirm(@Body() body: PasswordDto, @Param() param: any): Promise<void> {
    try {
      await this.passwordResetService.changePassword(param.uuid, body.password)
    } catch (error) {
      console.log(error);
    }
  }

  // @Put('/:id')
  // async update(@Param('id') id: ObjectID, @Body() data: UserUpdate): Promise<User> {
  //   try {
  //     this.logger.log('Starting Update User', 'UserController.update');
  //     return await this.updateUserService.update(id, data);
  //   } catch (error) {
  //     this.logger.error('Error Update User', error);
  //     throw new InternalServerErrorException('Internal error');
  //   }
  // }

  // @Delete('/:id')
  // async remove(@Param('id') id: ObjectID): Promise<void> {
  //   try {
  //     this.logger.log('Starting remove User', 'UserController.remove');
  //     return await this.removeUserService.remove(id);
  //   } catch (error) {
  //     this.logger.error('Error remove User', error);
  //     throw new InternalServerErrorException('Internal error');
  //   }
  // }
}
