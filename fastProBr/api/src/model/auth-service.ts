import { Prisma } from '@prisma/client';
import { DecodedAuthToken } from './decoded-auth-token';
import Joi from 'joi';
import { SafeUser } from './safe-user';

export type SignUpData = Omit<Prisma.UserCreateInput, 'id'>;

export const singUpDataSchema = Joi.object<SignUpData>({
    name: Joi.string().required(),
    email: Joi.string()
        .email({
            allowUnicode: false,
        })
        .required(),
    hashedPassword: Joi.string().required(),
    phone: Joi.string()
        .length(20)
        .replace(/(\d{2})(\d{2})(\d{1})(\d{4})(\d{4})/, '+$1 ($2) $3 $4-$5')
        .required(),
}).required();

export interface IAuthService {
    verifyToken(token: string): Promise<DecodedAuthToken>;
    signIn(email: string, hashedPassword: string): Promise<{ token: string; id: string }>;
    signUp(data: SignUpData): Promise<SafeUser>;
}
