import { InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import * as dayjs from 'dayjs'
import { PasswordReset } from "src/domain/protocols/password-reset/password-reset.interface";
import { User } from "src/domain/protocols/user/user.interface";
import { PasswordResetService } from "src/domain/services/password-reset/password-reset.service";
import { PasswordResetRepository } from "src/infrastructure/repository/password-reset.repository";
import { UserRepository } from "src/infrastructure/repository/user.repository";
import { BcryptService } from "src/utils/bcrypt/bcrypt.service";

describe('Domain :: Services :: Password-Reset :: PasswordResetService', () => {

  let uRepository;
  let bcryptService;
  let pswResetRepository;
  let passwordResetService;
  let notificationService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetService],
      providers: [
        {
          provide: 'AMQP_NOTIFICATION_SERVICE',
          useValue: {
            send: jest.fn()
          }
        },
        {
          provide: PasswordResetRepository,
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
          }
        },
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn(),
            partialUpdate: jest.fn(),
            find: jest.fn()
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

    notificationService = await moduleRef.get<ClientProxy>('AMQP_NOTIFICATION_SERVICE');
    uRepository = await moduleRef.get<UserRepository>(UserRepository);
    bcryptService = await moduleRef.get<BcryptService>(BcryptService);
    pswResetRepository = await moduleRef.get<PasswordResetRepository>(PasswordResetRepository);
    passwordResetService = await moduleRef.get<PasswordResetService>(PasswordResetService);

  });

  beforeAll(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    it('should throw an NotFoundException if email not exixts in database', async () => {
      const data = 'notexists@email.com.br';
      const spyVerifyEmailExists = jest.spyOn(passwordResetService, 'verifyEmailExists').mockResolvedValue(false);
      try {
        await passwordResetService.execute(data);
        expect(spyVerifyEmailExists).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
      }
    });

    it('should throw a InternalServerErrorException if can`t save password reset in database', async () => {
      const data = 'exists@email.com.br';
      const fakePswReset: PasswordReset = {
        uuid: 'some_uuidv4',
        email: 'exists@email.com.br',
        expireIn: 'some_date',
        link: 'some_link_to_reset_password'
      };
      const spyVerifyEmailExists = jest.spyOn(passwordResetService, 'verifyEmailExists').mockResolvedValue(true);
      const spyPswResetRepository = jest.spyOn(pswResetRepository, 'save').mockResolvedValue(null);
      try {
        await passwordResetService.execute(data);
        expect(spyVerifyEmailExists).toBeTruthy();
        expect(spyPswResetRepository).toHaveBeenCalledWith(fakePswReset);
        expect(spyPswResetRepository).resolves.toBeNull();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should send message if email is valid and password reset saved in database', async () => {
      const data = 'exists@email.com.br';
      const fakePswReset: PasswordReset = {
        uuid: 'some_uuidv4',
        email: 'exists@email.com.br',
        expireIn: 'some_date',
        link: 'some_link_to_reset_password'
      };
      const spyVerifyEmailExists = jest.spyOn(passwordResetService, 'verifyEmailExists').mockResolvedValue(true);
      const spysendMessage = jest.spyOn(passwordResetService, 'sendMessage').mockResolvedValue(true);
      const spyPswResetRepository = jest.spyOn(pswResetRepository, 'save').mockResolvedValue(fakePswReset);

      await passwordResetService.execute(data);
      expect(spyVerifyEmailExists).toBeTruthy();
      expect(spyPswResetRepository).toHaveBeenCalledWith(expect.objectContaining({
        uuid: expect.any(String),
        email: expect.any(String),
        expireIn: expect.any(String),
        link: expect.any(String),
      }));
      expect(spyPswResetRepository).not.toBeNull();
      expect(spysendMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('changePassword', () => {
    it('should throw a InternalServerErrorException if not find uuid in database', async () => {
      const fakePswReset: PasswordReset = {
        uuid: 'some_uuidv4',
        email: 'exists@email.com.br',
        expireIn: '2021-11-17T12:00:00Z',
        link: 'some_link_to_reset_password'
      };

      const fakeParams = {
        uuid: 'some_uuid',
        password: 'some_password'
      };

      const spyPswResetRepository = jest.spyOn(pswResetRepository, 'find').mockResolvedValue([]);
      try {
        await passwordResetService.changePassword(fakeParams.uuid, fakeParams.password);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }

      expect(spyPswResetRepository).toHaveBeenCalledWith(expect.objectContaining({
        uuid: expect.any(String)
      }));

    });

    it('should throw an UnauthorizedException if token time expired', async () => {
      const fakePswReset: PasswordReset = {
        uuid: 'some_uuidv4',
        email: 'exists@email.com.br',
        expireIn: '2021-11-17T12:00:00Z',
        link: 'some_link_to_reset_password'
      };

      const fakeParams = {
        uuid: 'some_uuid',
        password: 'some_password'
      };

      const spyPswResetRepository = jest.spyOn(pswResetRepository, 'find').mockResolvedValue([fakePswReset]);

      try {
        await passwordResetService.changePassword(fakeParams.uuid, fakeParams.password);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }

      expect(spyPswResetRepository).toHaveBeenCalledWith(expect.objectContaining({
        uuid: expect.any(String)
      }));

    });

    it('should generate an bcrypt hash if password reset find in database and token time not expired', async () => {
      const date = dayjs().add(1, 'h').toISOString();
      const fakePswReset: PasswordReset = {
        uuid: 'some_uuidv4',
        email: 'exists@email.com.br',
        expireIn: date,
        link: 'some_link_to_reset_password'
      };

      const fakeParams = {
        uuid: 'some_uuid',
        password: 'some_password'
      };

      const spyPswResetRepository = jest.spyOn(pswResetRepository, 'find').mockResolvedValue([fakePswReset]);
      const spyBcryptService = jest.spyOn(bcryptService, 'hash').mockResolvedValue('zxc-123-asd');

      await passwordResetService.changePassword(fakeParams.uuid, fakeParams.password);

      expect(spyPswResetRepository).toHaveBeenCalledWith(expect.objectContaining({
        uuid: expect.any(String)
      }));
      expect(spyBcryptService).toHaveBeenCalledWith(fakeParams.password);

    });
  });

  describe('sendMessage', () => {
    it('should send message to queue', async () => {
      const data = 'exists@email.com.br';
      const fakePswReset: PasswordReset = {
        uuid: 'some_uuidv4',
        email: 'exists@email.com.br',
        expireIn: 'some_date',
        link: 'some_link_to_reset_password'
      };
      const spyNotificationService = jest.spyOn(notificationService, 'send').mockReturnValue({ subscribe: () => { } });
      await passwordResetService.sendMessage(fakePswReset);

      expect(spyNotificationService).toHaveBeenCalledWith({ cmd: 'password-reset' }, { data: fakePswReset });
    });
  });

  describe('verifyEmailExists', () => {
    it('should return false when email not exists in database', async () => {
      const data = 'exists@email.com.br';
      
      jest.spyOn(uRepository, 'find').mockResolvedValue([]);
      
      const response = await passwordResetService.verifyEmailExists(data);

      expect(response).toBe(false);
    });

    it('should return true when email exists in database', async () => {
      const data = 'exists@email.com.br';
      const fakeUser: User = {
        email: 'exists@email.com.br',
        name: 'João',
        password: '123456789',
        id: '123'
      }
      
      jest.spyOn(uRepository, 'find').mockResolvedValue([fakeUser]);
      
      const response = await passwordResetService.verifyEmailExists(data);

      expect(response).toBe(true);
    });
  });

});