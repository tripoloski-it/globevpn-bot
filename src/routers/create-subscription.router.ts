import { Router } from '@grammyjs/router';
import { IContext } from '../types';
import { InlineKeyboard, NextFunction } from 'grammy';
import { ButtonPayload } from '../constants';
import { getCreateSubscriptionKeyboard } from '../keyboards';
import { subscriptions } from '../services';
import { getBackButton } from '../buttons';

const router = new Router<IContext>(ctx => ctx.session.step);

async function cancelActionHandler(ctx: IContext, next: NextFunction) {
	ctx.session = {};
	return await next();
}

const title = router.route('subscription_ask_title');
title.callbackQuery(ButtonPayload.ControlPanel, cancelActionHandler);
title.on('message:text', async ctx => {
	await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);
	ctx.session.title = ctx.message.text;
	ctx.session.step = 'subscription_ask_duration';
	await ctx.api.editMessageText(
		ctx.chat.id,
		ctx.session.messageId,
		ctx.t('ask_subscription_duration'),
		{
			reply_markup: getCreateSubscriptionKeyboard(ctx),
		},
	);
});

const duration = router.route('subscription_ask_duration');
duration.callbackQuery(ButtonPayload.ControlPanel, cancelActionHandler);
duration.on('message:text', async ctx => {
	await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);

	const durationInDays = parseInt(ctx.message?.text);
	if (isNaN(durationInDays) || durationInDays < 1) {
		await ctx.api.editMessageText(
			ctx.chat.id,
			ctx.session.messageId,
			ctx.t('ask_subscription_duration'),
			{
				reply_markup: getCreateSubscriptionKeyboard(ctx),
			},
		);
		return;
	}

	ctx.session.durationInDays = durationInDays;
	ctx.session.step = 'subscription_ask_price';
	await ctx.api.editMessageText(
		ctx.chat.id,
		ctx.session.messageId,
		ctx.t('ask_subscription_price'),
		{
			reply_markup: getCreateSubscriptionKeyboard(ctx),
		},
	);
});

const price = router.route('subscription_ask_price');
price.callbackQuery(ButtonPayload.ControlPanel, cancelActionHandler);
price.on('message:text', async ctx => {
	await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);

	const price = parseFloat(ctx.message?.text);
	if (isNaN(price) || price < 100) {
		await ctx.api.editMessageText(
			ctx.chat.id,
			ctx.session.messageId,
			ctx.t('ask_subscription_price'),
			{
				reply_markup: getCreateSubscriptionKeyboard(ctx),
			},
		);
		return;
	}

	const { durationInDays, title } = ctx.session;

	const subscription = await subscriptions.create({
		durationInDays,
		title,
		price,
		createdBy: { connect: { id: ctx.user.id } },
	});

	await ctx.api.editMessageText(
		ctx.chat.id,
		ctx.session.messageId,
		ctx.t('subscription_created_message', { subscriptionId: subscription.id }),
		{
			reply_markup: new InlineKeyboard()
				.text(
					ctx.t('open_subscription_button', { subscriptionId: subscription.id }),
					ButtonPayload.EditSubscription.Value(subscription.id),
				)
				.row()
				.add(getBackButton(ctx, ButtonPayload.ControlPanel)),
		},
	);
	ctx.session = {};
});

export { router as createSubsRouter };
