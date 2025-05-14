import { injectable } from 'inversify';
import { Env, EnvKeys, envSchema } from '../model/env';
import { config as configDotEnv } from 'dotenv';
import { ApiError } from '../model/api-error';

export interface IConfig {
    env: Env;
    validate(): void;
}

@injectable()
export class Config implements IConfig {
    constructor() {
        configDotEnv();
        this.env = Object.values(EnvKeys).reduce((acc, key) => ({ ...acc, [key]: process.env[key] || '' }), {}) as Env;
    }

    env: Env;

    validate() {
        const result = envSchema.validate(this.env, {
            abortEarly: false,
        });

        if (result.error !== undefined) {
            throw new ApiError(
                '500_INTERNAL_SERVER_ERROR',
                `Invalid environment variables: ${result.error.annotate()}`,
            );
        }
    }
}
