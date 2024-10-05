import { Prisma, PrismaClient } from '@prisma/client';
declare class SubscriptionsSerivice {
    private subscriptions;
    constructor(subscriptions: PrismaClient['subscriptions']);
    create(data: Prisma.SubscriptionsCreateInput): Promise<{
        id: number;
        title: string;
        price: number;
        durationInDays: number;
        createdById: number;
        createdAt: Date;
    }>;
    paginate(page: number, countPerPage: number): Promise<{
        totalCount: number;
        data: {
            id: number;
            title: string;
            price: number;
            durationInDays: number;
            createdById: number;
            createdAt: Date;
        }[];
        currentPage: number;
        nextPage: number | null;
        previousPage: number | null;
    } | null>;
    findById(id: number): Promise<{
        id: number;
        title: string;
        price: number;
        durationInDays: number;
        createdById: number;
        createdAt: Date;
    } | null>;
    updateById(id: number, data: Prisma.SubscriptionsUpdateInput): Promise<void>;
    deleteById(id: number): Promise<boolean>;
}
export declare const subscriptions: SubscriptionsSerivice;
export {};
//# sourceMappingURL=subscriptions.service.d.ts.map