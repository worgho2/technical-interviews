/* eslint-disable @typescript-eslint/no-unused-vars */
import '@abraham/reflection';
import { Prisma } from '@prisma/client';
import { SafeUser } from '../../src/model/safe-user';
import { JwtAuthService } from '../../src/service/jwt-auth';
import { IUserService } from '../../src/service/user';
import { IConfig } from '../../src/core/config';
import { Env } from '../../src/model/env';
import { cleanUpMetadata } from 'inversify-express-utils';
import jwt from 'jsonwebtoken';
import { DecodedAuthToken } from '../../src/model/decoded-auth-token';
import { ApiError } from '../../src/model/api-error';

class MockUserService implements IUserService {
    getUserByEmail(email: string): Promise<SafeUser | null> {
        throw new Error('Method not implemented.');
    }
    getUserByEmailAndHashedPassword(email: string, hashedPassword: string): Promise<SafeUser | null> {
        throw new Error('Method not implemented.');
    }
    createUser(data: Prisma.UserUncheckedCreateInput): Promise<SafeUser> {
        throw new Error('Method not implemented.');
    }
    getUserById(id: string): Promise<SafeUser> {
        throw new Error('Method not implemented.');
    }
}

class MockConfig implements IConfig {
    env: Env = {
        PORT: '3000',
        DATABASE_URL: 'DATABASE_URL',
        JWT_SECRET: 'JWT_SECRET',
        POKE_API_URL: 'POKE_API_URL',
    };
    validate(): void {
        throw new Error('Method not implemented.');
    }
}

describe('JwtAuthService', () => {
    describe('verifyToken', () => {
        beforeEach(() => {
            cleanUpMetadata();
        });

        test('should throw an error when the token is malformed', async () => {
            const mockUserService = new MockUserService();
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);

            const verifyToken = jwtAuthService.verifyToken('invalid-token');

            await expect(Promise.resolve(verifyToken)).rejects.toThrow(Error);
        });

        test('should throw an error if the token is expired', async () => {
            const mockUserService = new MockUserService();
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);
            const token = jwt.sign({ id: '1', iat: 0 }, mockConfig.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '1ms',
            });

            const verifyToken = jwtAuthService.verifyToken(token);

            await expect(Promise.resolve(verifyToken)).rejects.toThrow(Error);
        });

        test('should return stripped decodedAuthToken', async () => {
            const mockUserService = new MockUserService();
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);
            const decodedAuthToken: DecodedAuthToken = {
                id: '1',
            };
            const token = jwt.sign({ ...decodedAuthToken, anotherField: 'strip-me' }, mockConfig.env.JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '1h',
            });

            const verifyToken = jwtAuthService.verifyToken(token);

            await expect(Promise.resolve(verifyToken)).resolves.toStrictEqual(decodedAuthToken);
        });
    });

    describe('signIn', () => {
        beforeEach(() => {
            cleanUpMetadata();
        });

        test('should throw an error when the user does not exist', async () => {
            const mockUserService = new MockUserService();
            jest.spyOn(mockUserService, 'getUserByEmailAndHashedPassword').mockResolvedValue(Promise.resolve(null));
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);

            const signIn = jwtAuthService.signIn('email', 'password');

            await expect(Promise.resolve(signIn)).rejects.toThrow(ApiError);
        });

        test('should return a token', async () => {
            const mockUserService = new MockUserService();
            const user: SafeUser = {
                id: '1',
                name: 'name',
                email: 'email@email.com',
                phone: '+55 (99) 9 9999-9999',
            };
            jest.spyOn(mockUserService, 'getUserByEmailAndHashedPassword').mockResolvedValue(Promise.resolve(user));
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);

            const signIn = jwtAuthService.signIn('email', 'password');

            await expect(Promise.resolve(signIn)).resolves.toHaveProperty('id', '1');
            await expect(Promise.resolve(signIn)).resolves.toHaveProperty('token');
        });
    });

    describe('signUp', () => {
        beforeEach(() => {
            cleanUpMetadata();
        });

        test('should throw an error when the user already exists', async () => {
            const mockUserService = new MockUserService();
            const user: SafeUser = {
                id: '1',
                name: 'name',
                email: 'email@email.com',
                phone: '+55 (99) 9 9999-9999',
            };
            jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValue(Promise.resolve(user));
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);

            const signUp = jwtAuthService.signUp({
                name: user.name,
                email: user.email,
                hashedPassword: 'hashedPassword',
                phone: user.phone,
            });

            await expect(Promise.resolve(signUp)).rejects.toThrow(ApiError);
        });

        test('should return a user when email was not registered yet', async () => {
            const mockUserService = new MockUserService();
            const user: SafeUser = {
                id: '1',
                name: 'name',
                email: 'email@email.com',
                phone: '+55 (99) 9 9999-9999',
            };
            jest.spyOn(mockUserService, 'getUserByEmail').mockResolvedValue(Promise.resolve(null));
            jest.spyOn(mockUserService, 'createUser').mockResolvedValue(Promise.resolve(user));
            const mockConfig = new MockConfig();
            const jwtAuthService = new JwtAuthService(mockConfig, mockUserService);

            const signUp = jwtAuthService.signUp({
                name: user.name,
                email: user.email,
                hashedPassword: 'hashedPassword',
                phone: user.phone,
            });

            await expect(Promise.resolve(signUp)).resolves.toHaveProperty('id', '1');
        });
    });
});
