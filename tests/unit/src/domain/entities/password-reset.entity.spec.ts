import { PasswordResetEntity } from "src/domain/entities/password-reset/password-reset.entity";
import { ObjectID } from 'mongodb';

describe('domain :: entities :: PasswordResetEntity', () => {
  test('should return a PasswordResetEntity instance when receive valid values', () => {
    const mockObjectId = new ObjectID;
    const character = new PasswordResetEntity({
        id: mockObjectId,
        uuid: 'd9675c88-23b8-4030-8fa5-93e0abbaa17e',
        link: 'http:/localhost:3000/some_here',
        email: 'email',
        expireIn: '321321'
    });

    expect(character).toBeInstanceOf(PasswordResetEntity);
  });
});