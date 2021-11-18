import { Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PasswordReset } from 'src/domain/protocols/password-reset/password-reset.interface';
import { PasswordResetRepository } from 'src/infrastructure/repository/password-reset.repository';
import { UserRepository } from 'src/infrastructure/repository/user.repository';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs'
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

@Injectable()
export class PasswordResetService {

  constructor(
    @Inject('AMQP_NOTIFICATION_SERVICE') 
    private notificationService: ClientProxy,
    private uRepository: UserRepository,
    private pswResetRepository: PasswordResetRepository,
    private bcryptService: BcryptService
  ) { }

  async execute(data: string): Promise<any> {
    const result = await this.verifyEmailExists(data);

    if (!result) {
      throw new NotFoundException('E-mail not exists in database');
    }

    const uuid = uuidv4();

    const pswReset: PasswordReset = {
      uuid: uuid,
      email: data,
      link: `${process.env.BASE_URL}:${process.env.PORT}/${process.env.URL_RESET_PASSWORD}/${uuid}`,
      expireIn: dayjs().add(1, 'h').toISOString()
    }

    const message = await this.pswResetRepository.save(pswReset);
    if (!message) {
      throw new InternalServerErrorException('Something going wrong');
    }

    this.sendMessage(message);
  }

  async changePassword(uuid: string, password: string) {

    const reset = await this.pswResetRepository.find({ uuid: uuid });
    if (reset.length === 0) {
      throw new InternalServerErrorException('Something going wrong');
    }

    if (dayjs().toISOString() > reset[0].expireIn) {
      throw new UnauthorizedException('Token time expired');
    }

    const newPassword = await this.bcryptService.hash(password);

    await this.uRepository.partialUpdate(reset[0].email, { password: newPassword });

  }

  sendMessage(message: any) {
    this.notificationService.send<any>({ cmd: 'password-reset' }, { data: message }).subscribe();
  }

  private async verifyEmailExists(email: string): Promise<boolean> {
    const emailExists = await this.uRepository.find({ email: email });
    if (emailExists.length === 0) {
      return false;
    }
    return true;
  }



}
