import { Router } from '@grammyjs/router';
import { IContext } from '../types';
import { ButtonPayload } from '../constants';
import { InlineKeyboard } from 'grammy';
import { validate } from 'deep-email-validator';
import { users } from '../services';
import { isDefaultAdmin } from '../utils';

const router = new Router<IContext>(ctx => ctx.session.step);

const askUserEmail = router.route('ask_user_email');
askUserEmail.on('message:text', async ctx => {
	await ctx.deleteMessage();
	const email = ctx.message.text;
	const { valid, validators, reason } = await validate(email);

	if (
		!valid ||
		(reason && !validators[reason as keyof typeof validators]?.reason?.includes('run out of space'))
	) {
		console.info(
			'Invalid email:',
			email.slice(0, 65),
			reason ? validators[reason as keyof typeof validators]?.reason : validators,
		);
		return await ctx.api.editMessageText(
			ctx.chat.id,
			ctx.session.messageId,
			ctx.t('invalid_user_email_message'),
			{
				reply_markup: new InlineKeyboard().text(ctx.t('cancel_button'), ButtonPayload.Cancel),
			},
		);
	}

	await users.findOrCreate(
		ctx.from.id.toString(),
		email,
		ctx.from.username,
		isDefaultAdmin(ctx.from.id.toString()),
	);
	await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('email_saved_message'), {
		reply_markup: new InlineKeyboard().text(ctx.t('main_menu_button'), ButtonPayload.MainMenu),
	});
	ctx.session = {};
});
askUserEmail.callbackQuery(ButtonPayload.Cancel, async ctx => {
	ctx.session = {};
	await ctx.editMessageText(ctx.t('start_message'), {
		reply_markup: new InlineKeyboard().text(ctx.t('start_button'), ButtonPayload.MainMenu),
	});
});

export { router as registerUserRouter };
