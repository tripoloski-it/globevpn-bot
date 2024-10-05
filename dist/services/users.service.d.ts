import { Prisma, PrismaClient } from '@prisma/client';
declare class Users {
    private users;
    constructor(users: PrismaClient['users']);
    findOrCreate(telegramId: string, email: string, username?: string, isDefaultAdmin?: boolean): Promise<{
        id: number;
        email: string;
        username: string | null;
        isAdmin: boolean;
        createdAt: Date;
        telegramId: string;
    }>;
    findByTelegramId(telegramId: string): Promise<{
        id: number;
        email: string;
        username: string | null;
        isAdmin: boolean;
        createdAt: Date;
        telegramId: string;
    } | null>;
    updateById(id: number, data: Omit<Prisma.UsersUpdateInput, 'id'>): Promise<{
        id: number;
        email: string;
        username: string | null;
        isAdmin: boolean;
        createdAt: Date;
        telegramId: string;
    }>;
}
export declare const users: Users;
export {};
//# sourceMappingURL=users.service.d.ts.map