import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();

const getPasswordHash = (password: string): string => createHash('sha256').update(password).digest('base64');

async function main() {
    await prisma.user.create({
        data: {
            name: 'admin',
            email: 'admin@admin.com',
            phone: '+99 (99) 9 9999-9999',
            hashedPassword: getPasswordHash('admin'),
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
