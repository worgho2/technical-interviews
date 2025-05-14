import { SignUpData, singUpDataSchema } from '../../src/model/auth-service';
import { getValidated } from '../../src/utils/data-validation';

describe('signUpDataSchema', () => {
    test('should throw error when any property is empty', async () => {
        const data: SignUpData = {
            name: 'name',
            email: 'email@email.com',
            hashedPassword: 'hashedPassword',
            phone: '+55 (99) 9 9999-9999',
        };

        for (const key in data) {
            const changedData = { ...data, [key]: '' };

            const validatedData = getValidated<SignUpData>(singUpDataSchema, changedData);

            await expect(Promise.resolve(validatedData)).rejects.toThrow(Error);
        }
    });

    test('should throw error when email is invalid', async () => {
        const data: SignUpData = {
            name: 'name',
            email: '@email,com',
            hashedPassword: 'hashedPassword',
            phone: '+55 (99) 9 9999-9999',
        };

        const validatedData = getValidated<SignUpData>(singUpDataSchema, data);

        await expect(Promise.resolve(validatedData)).rejects.toThrow(Error);
    });

    test('should throw error when phone is incorrect', async () => {
        const data: SignUpData = {
            name: 'name',
            email: 'email@email.com',
            hashedPassword: 'hashedPassword',
            phone: '41996892354',
        };

        const validatedData = getValidated<SignUpData>(singUpDataSchema, data);

        await expect(Promise.resolve(validatedData)).rejects.toThrow(Error);
    });
});
