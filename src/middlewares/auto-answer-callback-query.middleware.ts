import { Context, NextFunction } from 'grammy';

export const autoAnswerCallbackQueryMiddleware = async (ctx: Context, next: NextFunction) => {
	let called = false;
	ctx.api.config.use((prev, method, payload, signal) => {
		if (method === 'answerCallbackQuery') called = true;
		return prev(method, payload, signal);
	});
	try {
		return await next();
	} finally {
		if (ctx.callbackQuery && !called) {
			await ctx.answerCallbackQuery().catch(() => {});
		}
	}
};
