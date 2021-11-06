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
    
});