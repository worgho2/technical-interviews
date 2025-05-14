import { inject, injectable } from 'inversify';
import { DATA } from '../types';
import { IUserData } from '../data/user';
import { Prisma } from '@prisma/client';
import { ApiError } from '../model/api-error';
import { SafeUser } from '../model/safe-user';

export interface IUserService {
    getUserById(id: string): Promise<SafeUser>;
    getUserByEmail(email: string): Promise<SafeUser | null>;
    getUserByEmailAndHashedPassword(email: string, hashedPassword: string): Promise<SafeUser | null>;
    createUser(data: Prisma.UserUncheckedCreateInput): Promise<SafeUser>;
}

@injectable()
export class UserService implements IUserService {
    constructor(@inject(DATA.user) private userData: IUserData) {}

    async getUserById(id: string): Promise<SafeUser> {
        const user = await this.userData.getUserById(id);

        if (user === null) {
            throw new ApiError('404_NOT_FOUND', 'User not found');
        }

        return user;
    }

    async getUserByEmail(email: string): Promise<SafeUser | null> {
        return this.userData.getUserByEmail(email);
    }

    async getUserByEmailAndHashedPassword(email: string, hashedPassword: string): Promise<SafeUser | null> {
        return this.userData.getUserByEmailAndHashedPassword(email, hashedPassword);
    }

    async createUser(data: Prisma.UserUncheckedCreateInput): Promise<SafeUser> {
        return this.userData.createUser(data);
    }
}
