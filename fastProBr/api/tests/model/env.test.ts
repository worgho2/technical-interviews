import { Env, envSchema } from '../../src/model/env';
import { getValidated } from '../../src/utils/data-validation';

test('envSchema should be valid', async () => {
    const env: Env = {
        PORT: 'PORT',
        DATABASE_URL: 'DATABASE_URL',
        JWT_SECRET: 'JWT_SECRET',
        POKE_API_URL: 'POKE_API_URL',
    };

    for (const envKey in env) {
        const changedEnv = { ...env, [envKey]: undefined };

        const validatedEnv = getValidated<Env>(envSchema, changedEnv);

        await expect(Promise.resolve(validatedEnv)).rejects.toThrow(Error);
    }
});
