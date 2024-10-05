"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
const config_1 = require("../config");
const exceljs_1 = require("exceljs");
const utils_1 = require("../utils");
class OrdersService {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    async paginateByUserId(userId, page, countPerPage) {
        const totalCount = await this.orders.count({ where: { userId } });
        if (!totalCount)
            return null;
        const payments = await this.orders.findMany({
            skip: page * countPerPage,
            take: countPerPage,
            where: { userId },
        });
        const hasNextPage = (page + 1) * countPerPage < totalCount;
        const hasPreviousPage = page > 0;
        return {
            totalCount,
            data: payments,
            currentPage: page,
            nextPage: hasNextPage ? page + 1 : null,
            previousPage: hasPreviousPage ? page - 1 : null,
        };
    }
    async create(data) {
        const order = await this.orders.create({ data });
        return order;
    }
    async getByOrderId(id) {
        const order = await this.orders.findUnique({ where: { id } });
        return order;
    }
    async getAll() {
        const orders = await this.orders.findMany({});
        return orders;
    }
    async createReport() {
        const orders = await this.orders.findMany({
            include: {
                user: {
                    select: { username: true },
                },
            },
        });
        const data = orders.map(order => ({
            id: order.id.toString(),
            tgUsername: order.user.username,
            title: order.title,
            amount: order.amount.toLocaleString('de-DE', { currency: 'RUB' }),
            link: order.link,
            username: order.username,
            paymentSystem: order.paymentSystem,
            telegramPaymentChargeId: order.telegramPaymentChargeId.toString(),
            providerPaymentChargeId: order.providerPaymentChargeId.toString(),
            expireAt: (0, utils_1.formatTime)(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
            createdAt: (0, utils_1.formatTime)(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
        }));
        const workbook = new exceljs_1.Workbook();
        const worksheet = workbook.addWorksheet('Транзакции');
        const lengths = (0, utils_1.getMaxLengths)(data);
        worksheet.columns = [
            { width: lengths.id, header: '№', key: 'id' },
            { width: lengths.tgUsername, header: 'Пользователь', key: 'tgUsername' },
            { width: lengths.title, header: 'Товар', key: 'title' },
            { width: lengths.amount, header: 'Сумма', key: 'amount' },
            { width: 20, header: 'Ссылка', key: 'link' },
            { width: lengths.username, header: 'Proxy User', key: 'username' },
            { width: lengths.paymentSystem, header: 'Система', key: 'paymentSystem' },
            {
                width: lengths.telegramPaymentChargeId,
                header: 'TelegramPID',
                key: 'telegramPaymentChargeId',
            },
            {
                width: lengths.providerPaymentChargeId,
                header: 'YookassaPID',
                key: 'providerPaymentChargeId',
            },
            { width: lengths.expireAt, header: 'Действует до', key: 'expireAt' },
            { width: lengths.createdAt, header: 'Дата', key: 'createdAt' },
        ];
        data.forEach(row => worksheet.addRow(row));
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
    async deleteAll() {
        const { count } = await this.orders.deleteMany({});
        return count;
    }
    async getAllByTelegramUsername(usernameOrTelegramId, page, countPerPage) {
        const condition = {
            where: {
                user: {
                    OR: [{ username: usernameOrTelegramId }, { telegramId: usernameOrTelegramId }],
                },
            },
            include: {
                user: {
                    select: {
                        telegramId: true,
                    },
                },
            },
            skip: page * countPerPage,
            take: countPerPage,
        };
        const totalCount = await this.orders.count({ where: condition.where });
        if (!totalCount)
            return null;
        const payments = await this.orders.findMany(condition);
        const hasNextPage = (page + 1) * countPerPage < totalCount;
        const hasPreviousPage = page > 0;
        return {
            totalCount,
            data: payments,
            currentPage: page,
            nextPage: hasNextPage ? page + 1 : null,
            previousPage: hasPreviousPage ? page - 1 : null,
        };
    }
}
exports.orders = new OrdersService(config_1.prisma.orders);
//# sourceMappingURL=orders.service.js.map