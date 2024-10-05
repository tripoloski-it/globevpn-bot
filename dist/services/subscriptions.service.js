"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = void 0;
const config_1 = require("../config");
class SubscriptionsSerivice {
    subscriptions;
    constructor(subscriptions) {
        this.subscriptions = subscriptions;
    }
    async create(data) {
        const subscription = await this.subscriptions.create({ data });
        console.log(`Add new subscription. ID: ${subscription.id}. Duration: ${subscription.durationInDays}d.`);
        return subscription;
    }
    async paginate(page, countPerPage) {
        const totalCount = await this.subscriptions.count({});
        if (!totalCount)
            return null;
        const subscriptions = await this.subscriptions.findMany({
            skip: page * countPerPage,
            take: countPerPage,
            orderBy: {
                createdAt: 'asc',
            },
        });
        const hasNextPage = (page + 1) * countPerPage < totalCount;
        const hasPreviousPage = page > 0;
        return {
            totalCount,
            data: subscriptions,
            currentPage: page,
            nextPage: hasNextPage ? page + 1 : null,
            previousPage: hasPreviousPage ? page - 1 : null,
        };
    }
    async findById(id) {
        const subscribtion = await this.subscriptions.findUnique({ where: { id } });
        return subscribtion;
    }
    async updateById(id, data) {
        const subscribtion = await this.subscriptions.update({ where: { id }, data });
    }
    async deleteById(id) {
        const { count } = await this.subscriptions.deleteMany({ where: { id } });
        return !!count;
    }
}
exports.subscriptions = new SubscriptionsSerivice(config_1.prisma.subscriptions);
//# sourceMappingURL=subscriptions.service.js.map