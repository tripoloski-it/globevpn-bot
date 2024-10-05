import { NextFunction } from 'grammy';
import { IContext } from '../types';
import { users } from '../services';
import { isDefaultAdmin } from '../utils';

export const insertUserToContextMiddleware = async (ctx: IContext, next: NextFunction) => {
	if (!ctx.from) return;

	const user = await users.findByTelegramId(ctx.from.id.toString());
	if (!user) return await next();

	if (isDefaultAdmin(user.telegramId.toString()) && !user.isAdmin) {
		ctx.user = await users.updateById(user.id, { isAdmin: true });
	}

	if (!isDefaultAdmin(user.telegramId.toString()) && user.isAdmin) {
		ctx.user = await users.updateById(user.id, { isAdmin: false });
	}

	ctx.user = ctx.user ?? user;
	ctx.isAdmin = ctx.user.isAdmin;

	return await next();
};
