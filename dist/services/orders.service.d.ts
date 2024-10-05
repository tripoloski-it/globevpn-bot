import { Prisma, PrismaClient } from '@prisma/client';
declare class OrdersService {
    private orders;
    constructor(orders: PrismaClient['orders']);
    paginateByUserId(userId: number, page: number, countPerPage: number): Promise<{
        totalCount: number;
        data: {
            id: number;
            title: string;
            amount: number;
            userId: number;
            link: string;
            username: string;
            paymentSystem: import(".prisma/client").$Enums.PaymentSystems;
            telegramPaymentChargeId: string;
            providerPaymentChargeId: string;
            expireAt: Date;
            createdAt: Date;
        }[];
        currentPage: number;
        nextPage: number | null;
        previousPage: number | null;
    } | null>;
    create(data: Prisma.OrdersCreateInput): Promise<{
        id: number;
        title: string;
        amount: number;
        userId: number;
        link: string;
        username: string;
        paymentSystem: import(".prisma/client").$Enums.PaymentSystems;
        telegramPaymentChargeId: string;
        providerPaymentChargeId: string;
        expireAt: Date;
        createdAt: Date;
    }>;
    getByOrderId(id: number): Promise<{
        id: number;
        title: string;
        amount: number;
        userId: number;
        link: string;
        username: string;
        paymentSystem: import(".prisma/client").$Enums.PaymentSystems;
        telegramPaymentChargeId: string;
        providerPaymentChargeId: string;
        expireAt: Date;
        createdAt: Date;
    } | null>;
    getAll(): Promise<{
        id: number;
        title: string;
        amount: number;
        userId: number;
        link: string;
        username: string;
        paymentSystem: import(".prisma/client").$Enums.PaymentSystems;
        telegramPaymentChargeId: string;
        providerPaymentChargeId: string;
        expireAt: Date;
        createdAt: Date;
    }[]>;
    createReport(): Promise<Buffer>;
    deleteAll(): Promise<number>;
    getAllByTelegramUsername(usernameOrTelegramId: string, page: number, countPerPage: number): Promise<{
        totalCount: number;
        data: ({
            user: {
                telegramId: string;
            };
        } & {
            id: number;
            title: string;
            amount: number;
            userId: number;
            link: string;
            username: string;
            paymentSystem: import(".prisma/client").$Enums.PaymentSystems;
            telegramPaymentChargeId: string;
            providerPaymentChargeId: string;
            expireAt: Date;
            createdAt: Date;
        })[];
        currentPage: number;
        nextPage: number | null;
        previousPage: number | null;
    } | null>;
}
export declare const orders: OrdersService;
export {};
//# sourceMappingURL=orders.service.d.ts.map