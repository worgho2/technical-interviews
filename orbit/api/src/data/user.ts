import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE } from '../types';
import { Prisma, PrismaClient } from '@prisma/client';
import { SafeUser } from '../model/safe-user';

export interface IUserData {
    getUserByEmail(email: string): Promise<SafeUser | null>;
    getUserById(id: string): Promise<SafeUser | null>;
    getUserByEmailAndHashedPassword(email: string, hashedPassword: string): Promise<SafeUser | null>;
    createUser(data: Prisma.UserUncheckedCreateInput): Promise<SafeUser>;
}

@injectable()
export class UserData implements IUserData {
    constructor(@inject(INFRASTRUCTURE.prismaClient) private prisma: PrismaClient) {}

    async getUserByEmail(email: string): Promise<SafeUser | null> {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });
    }

    async getUserById(id: string): Promise<SafeUser | null> {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });
    }

    async getUserByEmailAndHashedPassword(email: string, hashedPassword: string): Promise<SafeUser | null> {
        return await this.prisma.user.findFirst({
            where: {
                email,
                hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });
    }

    async createUser(data: Prisma.UserUncheckedCreateInput): Promise<SafeUser> {
        return await this.prisma.user.create({
            data,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });
    }
}
