import { Inject, Injectable } from '@nestjs/common';
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
      return { message: 'E-mail not exists in database', status: 404 };
    }

    const uuid = uuidv4();

    const pswReset: PasswordReset = {
      uuid: uuid,
      email: data,
      link: `http://localhost:3000/user/password/reset/${uuid}`,
      expireIn: dayjs().add(1, 'h').toISOString()
    }

    const message = await this.pswResetRepository.save(pswReset);
    if (!message) {
      return { message: 'Something going wrong', status: 500 };
    }

    this.sendMessage(message);
  }

  async changePassword(uuid: string, password: string) {

    const reset = await this.pswResetRepository.find({ uuid: uuid });
    if (reset.length === 0) {
      return { message: 'Something going wrong', status: 500 };
    }

    if (dayjs().toISOString() > reset[0].expireIn) {
      return { message: 'Token time expired', status: 417 };
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
