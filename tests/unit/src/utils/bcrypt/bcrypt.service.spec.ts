import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';

describe('Utils :: BCryptService', () => {
    beforeEach(async () => {});

    it('should return hash to password', async () => {
        const data = {
            password: 'cleber123'
        }
        const bcryptSut = new BcryptService();
        const response = await bcryptSut.hash(data.password);

        expect(response).not.toBeNull();
        expect(response).toHaveLength(60);
    });

    it('should return true if password is correct', async () => {
        const data = {
            password: 'cleber123',
            hashPassword: '$2b$10$0LA9.UnNFEkkegj6LxORjurkw7KniZa.Pej63HX5RTJc.7oeMxdE6'
        }
        const bcryptSut = new BcryptService();
        const response = await bcryptSut.compare(data.password, data.hashPassword);

        expect(response).toBeTruthy();
    });

});