import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config';

class SubscriptionsSerivice {
	constructor(private subscriptions: PrismaClient['subscriptions']) {}

	public async create(data: Prisma.SubscriptionsCreateInput) {
		const subscription = await this.subscriptions.create({ data });
		console.log(
			`Add new subscription. ID: ${subscription.id}. Duration: ${subscription.durationInDays}d.`,
		);
		return subscription;
	}

	public async paginate(page: number, countPerPage: number) {
		const totalCount = await this.subscriptions.count({});
		if (!totalCount) return null;

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

	public async findById(id: number) {
		const subscribtion = await this.subscriptions.findUnique({ where: { id } });
		return subscribtion;
	}

	public async updateById(id: number, data: Prisma.SubscriptionsUpdateInput) {
		const subscribtion = await this.subscriptions.update({ where: { id }, data });
	}

	public async deleteById(id: number) {
		const { count } = await this.subscriptions.deleteMany({ where: { id } });
		return !!count;
	}
}

export const subscriptions = new SubscriptionsSerivice(prisma.subscriptions);
