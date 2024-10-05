import { Router } from '@grammyjs/router';
import { IContext } from '../types';
import { InlineKeyboard, NextFunction } from 'grammy';
import { getBackButton } from '../buttons';
import { ButtonPayload } from '../constants';
import { subscriptions } from '../services';
import { formatTime } from '../utils';

const router = new Router<IContext>(ctx => ctx.session.step);

const cancelActionHandler = async (ctx: IContext, next: NextFunction) => {
	ctx.session = {};
	return await next();
};

const editSubscriptionTitleRouter = router.route('edit_subscription_title');
editSubscriptionTitleRouter.on('message:text', async ctx => {
	await ctx.deleteMessage();

	const subscriptionId = ctx.session.subscriptionId;
	const keyboard = new InlineKeyboard().add(
		getBackButton(ctx, ButtonPayload.EditSubscription.Value(subscriptionId)),
	);

	const subscription = await subscriptions.findById(subscriptionId);
	if (!subscription) {
		await ctx.api.editMessageText(
			ctx.chat.id,
			ctx.session.messageId,
			ctx.t('subscription_not_found'),
			{ reply_markup: keyboard },
		);
		ctx.session = {};
		return;
	}
	const title = ctx.message.text;

	await subscriptions.updateById(subscriptionId, { title });

	await ctx.api.editMessageText(
		ctx.chat.id,
		ctx.session.messageId,
		ctx.t('subscription_data_updated_message'),
		{
			reply_markup: new InlineKeyboard().add(
				getBackButton(ctx, ButtonPayload.EditSubscription.Value(subscriptionId)),
			),
		},
	);
	ctx.session = {};
});
editSubscriptionTitleRouter.callbackQuery(
	ButtonPayload.EditSubscription.Regexp,
	cancelActionHandler,
);

const editSubscriptionDurationRouter = router.route('edit_subscription_duration');
editSubscriptionDurationRouter.on('message:text', async ctx => {
	await ctx.deleteMessage();

	const subscriptionId = ctx.session.subscriptionId;
	const keyboard = new InlineKeyboard().add(
		getBackButton(ctx, ButtonPayload.EditSubscription.Value(subscriptionId)),
	);

	const subscription = await subscriptions.findById(subscriptionId);
	if (!subscription) {
		await ctx.api.editMessageText(
			ctx.chat.id,
			ctx.session.messageId,
			ctx.t('subscription_not_found'),
			{ reply_markup: keyboard },
		);
		ctx.session = {};
		return;
	}

	const durationInDays = parseInt(ctx.message?.text);
	if (isNaN(durationInDays) || durationInDays < 1) {
		await ctx.api.deleteMessage(ctx.chat.id, ctx.session.messageId);
		const message = await ctx.reply(ctx.t('edit_subscription_duration_message'), {
			reply_markup: new InlineKeyboard().add(
				getBackButton(
					ctx,
					ButtonPayload.EditSubscription.Value(subscriptionId),
					ctx.t('cancel_button'),
				),
			),
		});
		ctx.session.messageId = message.message_id;
		return;
	}

	await subscriptions.updateById(subscriptionId, { durationInDays });

	await ctx.api.editMessageText(
		ctx.chat.id,
		ctx.session.messageId,
		ctx.t('subscription_data_updated_message'),
		{
			reply_markup: new InlineKeyboard().add(
				getBackButton(ctx, ButtonPayload.EditSubscription.Value(subscriptionId)),
			),
		},
	);
	ctx.session = {};
});
editSubscriptionDurationRouter.callbackQuery(
	ButtonPayload.EditSubscription.Regexp,
	cancelActionHandler,
);

const editSubscriptionPriceRouter = router.route('edit_subscription_price');
editSubscriptionPriceRouter.on('message:text', async ctx => {
	await ctx.deleteMessage();

	const subscriptionId = ctx.session.subscriptionId;
	const keyboard = new InlineKeyboard().add(
		getBackButton(ctx, ButtonPayload.EditSubscription.Value(subscriptionId)),
	);

	const subscription = await subscriptions.findById(subscriptionId);
	if (!subscription) {
		await ctx.api.editMessageText(
			ctx.chat.id,
			ctx.session.messageId,
			ctx.t('subscription_not_found'),
			{ reply_markup: keyboard },
		);
		ctx.session = {};
		return;
	}

	const price = parseFloat(ctx.message?.text);
	if (isNaN(price) || price < 100) {
		await ctx.api.deleteMessage(ctx.chat.id, ctx.session.messageId);
		const message = await ctx.reply(ctx.t('edit_subscription_price_message'), {
			reply_markup: new InlineKeyboard().add(
				getBackButton(
					ctx,
					ButtonPayload.EditSubscription.Value(subscriptionId),
					ctx.t('cancel_button'),
				),
			),
		});
		ctx.session.messageId = message.message_id;
		return;
	}

	await subscriptions.updateById(subscriptionId, { price });

	await ctx.api.editMessageText(
		ctx.chat.id,
		ctx.session.messageId,
		ctx.t('subscription_data_updated_message'),
		{
			reply_markup: new InlineKeyboard().add(
				getBackButton(ctx, ButtonPayload.EditSubscription.Value(subscriptionId)),
			),
		},
	);
	ctx.session = {};
});
editSubscriptionPriceRouter.callbackQuery(
	ButtonPayload.EditSubscription.Regexp,
	cancelActionHandler,
);

export { router as subsRouter };
