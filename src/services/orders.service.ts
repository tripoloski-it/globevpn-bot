import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config';
import { Workbook } from 'exceljs';
import { formatTime, getMaxLengths } from '../utils';

class OrdersService {
	constructor(private orders: PrismaClient['orders']) {}

	public async paginateByUserId(userId: number, page: number, countPerPage: number) {
		const totalCount = await this.orders.count({ where: { userId } });
		if (!totalCount) return null;

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

	public async create(data: Prisma.OrdersCreateInput) {
		const order = await this.orders.create({ data });
		return order;
	}

	public async getByOrderId(id: number) {
		const order = await this.orders.findUnique({ where: { id } });
		return order;
	}

	public async getAll() {
		const orders = await this.orders.findMany({});
		return orders;
	}

	public async createReport() {
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
			expireAt: formatTime(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
			createdAt: formatTime(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
		}));

		const workbook = new Workbook();
		const worksheet = workbook.addWorksheet('Транзакции');

		const lengths = getMaxLengths(data);

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
		return buffer as Buffer;
	}

	public async deleteAll() {
		const { count } = await this.orders.deleteMany({});
		return count;
	}

	public async getAllByTelegramUsername(
		usernameOrTelegramId: string,
		page: number,
		countPerPage: number,
	) {
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
		if (!totalCount) return null;

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

export const orders = new OrdersService(prisma.orders);
