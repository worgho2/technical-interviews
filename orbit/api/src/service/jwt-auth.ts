import { inject, injectable } from 'inversify';
import { IAuthService, SignUpData, singUpDataSchema } from '../model/auth-service';
import { CORE, SERVICE } from '../types';
import { IConfig } from '../core/config';
import { DecodedAuthToken, decodedAuthTokenSchema } from '../model/decoded-auth-token';
import jwt from 'jsonwebtoken';
import { getValidated } from '../utils/data-validation';
import { IUserService } from './user';
import { ApiError } from '../model/api-error';
import { SafeUser } from '../model/safe-user';

@injectable()
export class JwtAuthService implements IAuthService {
    constructor(
        @inject(CORE.config) private config: IConfig,
        @inject(SERVICE.user) private userService: IUserService,
    ) {}

    async verifyToken(token: string): Promise<DecodedAuthToken> {
        const payload = jwt.verify(token, this.config.env.JWT_SECRET, {
            algorithms: ['HS256'],
        });

        return await getValidated<DecodedAuthToken>(decodedAuthTokenSchema, payload, {
            abortEarly: false,
            stripUnknown: true,
        });
    }

    async signIn(email: string, hashedPassword: string): Promise<{ token: string; id: string }> {
        const user = await this.userService.getUserByEmailAndHashedPassword(email, hashedPassword);

        if (user === null) {
            throw new ApiError('401_UNAUTHORIZED', 'Invalid credentials');
        }

        const payload: DecodedAuthToken = {
            id: user.id,
        };

        const token = jwt.sign(payload, this.config.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '12h',
        });

        return { id: user.id, token };
    }

    async signUp(data: SignUpData): Promise<SafeUser> {
        const validData = await getValidated<SignUpData>(singUpDataSchema, data, {
            abortEarly: false,
            stripUnknown: true,
        });

        const existingUser = await this.userService.getUserByEmail(validData.email);

        if (existingUser !== null) {
            throw new ApiError('400_BAD_REQUEST', 'Email already in use');
        }

        return await this.userService.createUser(validData);
    }
}
