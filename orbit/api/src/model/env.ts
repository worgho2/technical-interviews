import Joi from 'joi';

export enum EnvKeys {
    PORT = 'PORT',
    JWT_SECRET = 'JWT_SECRET',
    DATABASE_URL = 'DATABASE_URL',
    POKE_API_URL = 'POKE_API_URL',
}

export type Env = {
    [k in keyof typeof EnvKeys]: string;
};

export const envSchema = Joi.object<Env>({
    PORT: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    POKE_API_URL: Joi.string().required(),
}).required();
