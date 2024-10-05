import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../config';

class Users {
	constructor(private users: PrismaClient['users']) {}

	public async findOrCreate(
		telegramId: string,
		email: string,
		username?: string,
		isDefaultAdmin: boolean = false,
	) {
		const user = await this.users.findUnique({
			where: { telegramId },
		});
		if (user !== null) return user;

		const newUser = await this.users.create({
			data: {
				email,
				telegramId,
				isAdmin: isDefaultAdmin,
				username,
			},
		});
		console.log(`New user created. ID: ${newUser.id} (Is default admin: ${isDefaultAdmin})`);
		return newUser;
	}

	public async findByTelegramId(telegramId: string) {
		const user = await this.users.findUnique({
			where: { telegramId },
		});
		return user;
	}

	public async updateById(id: number, data: Omit<Prisma.UsersUpdateInput, 'id'>) {
		const user = await this.users.update({ where: { id }, data });
		return user;
	}
}

export const users = new Users(prisma.users);
