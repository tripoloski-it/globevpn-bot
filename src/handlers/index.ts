import { Composer, InlineKeyboard, InputFile, Keyboard } from 'grammy';
import { IContext } from '../types';
import { isAdminFilter, isUserExistFilter, isUserNotExistFilter } from '../filters';
import { marzban, orders, subscriptions, users } from '../services';
import {
	convertToArrayBuffer,
	createInvoicePayload,
	extractIdFromInvoicePayload,
	formatTime,
	isDefaultAdmin,
} from '../utils';
import {
	ButtonPayload,
	ORDERS_BUTTONS_PER_LINE,
	ORDERS_PER_PAGE,
	SUBSCRIPTIONS_BUTTONS_PER_PAGE,
	SUBSCRIPTIONS_PER_PAGE,
} from '../constants';
import {
	getControlPanelKeyboard,
	getCreateSubscriptionKeyboard,
	getMainMenuKEyboard,
	getPaginatedKeyboard,
	getSubscriptionKeyboard,
} from '../keyboards';
import { getBackButton } from '../buttons';
import { yookassa, YOOKASSA_TOKEN } from '../config';
import { CurrencyEnum, IConfirmationRedirect } from 'yookassa-sdk';

const composer = new Composer<IContext>().filter(ctx => ctx.chat?.type === 'private');

const userNotExistsComposer = composer.filter(isUserNotExistFilter);
userNotExistsComposer.callbackQuery(ButtonPayload.MainMenu, async ctx => {
	ctx.session.step = 'ask_user_email';
	ctx.session.messageId = ctx.msgId;
	await ctx.editMessageText(ctx.t('ask_user_email_message'), {
		reply_markup: new InlineKeyboard().text(ctx.t('cancel_button'), ButtonPayload.Cancel),
	});
});
userNotExistsComposer.use(async ctx => {
	await ctx.reply(ctx.t('start_message'), {
		reply_markup: new InlineKeyboard().text(ctx.t('start_button'), ButtonPayload.MainMenu),
	});
});

const userExistsComposer = composer.filter(isUserExistFilter);
userExistsComposer.callbackQuery(ButtonPayload.MainMenu, async ctx => {
	await ctx.editMessageText(ctx.t('main_menu_message'), { reply_markup: getMainMenuKEyboard(ctx) });
});
userExistsComposer.command('start', async ctx => {
	await ctx.reply(ctx.t('main_menu_message'), { reply_markup: getMainMenuKEyboard(ctx) });
});
userExistsComposer.callbackQuery(ButtonPayload.SubscriptionsList.Regexp, async ctx => {
	const [, , rawPage] = ctx.callbackQuery.data.split('_');
	const page = parseInt(rawPage);
	if (isNaN(page)) return;
	const subscriptionsList = await subscriptions.paginate(page, SUBSCRIPTIONS_PER_PAGE);
	if (!subscriptionsList)
		return await ctx.editMessageText(ctx.t('no_subscriptions_message'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});

	const keyboard = getPaginatedKeyboard({
		ctx,
		items: subscriptionsList.data,
		nextPage: subscriptionsList.nextPage,
		previousPage: subscriptionsList.previousPage,
		buttonsPerLine: SUBSCRIPTIONS_BUTTONS_PER_PAGE,
		getButtonTitle: (item, index) => (index + 1).toString(),
		getButtonPayload: (item, index) => ButtonPayload.SubscriptionMenu.Value(item.id),
		getControlButtonsPayload: () => [
			ButtonPayload.SubscriptionsList.Value(subscriptionsList.previousPage || 0),
			ButtonPayload.SubscriptionsList.Value(subscriptionsList.nextPage || 0),
		],
		backButtonPayload: ButtonPayload.MainMenu,
	});

	await ctx.editMessageText(
		ctx.t('subscriptions_list_message', {
			currentPage: page + 1,
			totalPages: Math.ceil(subscriptionsList.totalCount / SUBSCRIPTIONS_PER_PAGE),
			subscriptionsList: subscriptionsList.data
				.map((subscriptionsList, index) =>
					ctx.t('subscriptions_list_chunk', {
						index: index + 1,
						title: subscriptionsList.title,
					}),
				)
				.join('\n'),
		}),
		{
			reply_markup: keyboard,
		},
	);
});
userExistsComposer.callbackQuery(ButtonPayload.SubscriptionMenu.Regexp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	const subscription = await subscriptions.findById(subscriptionId);
	if (!subscription)
		return await ctx.editMessageText(ctx.t('subscription_not_found'), {
			reply_markup: new InlineKeyboard().add(
				getBackButton(ctx, ButtonPayload.SubscriptionsList.Value(0)),
			),
		});

	const message = [
		ctx.t('invoice_title'),
		ctx.t('invoice_description', {
			durationDays: subscription.durationInDays.toString(),
		}),
	].join('\n');

	const amount = { currency: CurrencyEnum.RUB, value: subscription.price.toFixed(2) };
	const response = await yookassa.payments.create({
		amount,
		metadata: {
			telegramId: ctx.user.telegramId,
			subscriptionId: subscription.id,
			messageId: ctx.msgId,
		},
		confirmation: { type: 'redirect', return_url: `https://t.me/${ctx.me.username}` },
		description: message,
		capture: true,
		receipt: {
			customer: {
				email: ctx.user.email,
			},
			items: [
				{
					description: message,
					amount,
					quantity: 1,
					vat_code: 1,
					payment_subject: 'service' as any,
					payment_mode: 'full_payment',
				},
			],
		},
	});

	const confirmation = response.confirmation as IConfirmationRedirect;

	ctx.session.payment = response.id;

	if (!confirmation.confirmation_url) {
		console.log(response);
		return await ctx.answerCallbackQuery({ text: `An error was occured!` });
	}

	await ctx.editMessageText(message, {
		reply_markup: getSubscriptionKeyboard(ctx, confirmation.confirmation_url!),
	});
});
userExistsComposer.callbackQuery(ButtonPayload.DeleteMessage, async ctx => {
	await ctx.answerCallbackQuery({ text: ctx.t('order_buy_canceled_alert') });
	await ctx.deleteMessage();
});
userExistsComposer.callbackQuery(ButtonPayload.MyOrders.Regexp, async ctx => {
	const [, , rawPage] = ctx.callbackQuery.data.split('_');
	const page = parseInt(rawPage);
	if (isNaN(page)) return;
	const userOrders = await orders.paginateByUserId(ctx.user.id, page, ORDERS_PER_PAGE);
	if (!userOrders)
		return await ctx.editMessageText(ctx.t('no_orders_message'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});

	const keyboard = getPaginatedKeyboard({
		ctx,
		items: userOrders.data,
		nextPage: userOrders.nextPage,
		previousPage: userOrders.previousPage,
		buttonsPerLine: SUBSCRIPTIONS_BUTTONS_PER_PAGE,
		getButtonTitle: (item, index) => (index + 1).toString(),
		getButtonPayload: (item, index) => ButtonPayload.Order.Value(item.id),
		getControlButtonsPayload: () => [
			ButtonPayload.MyOrders.Value(userOrders.previousPage || 0),
			ButtonPayload.MyOrders.Value(userOrders.nextPage || 0),
		],
		backButtonPayload: ButtonPayload.MainMenu,
	});

	await ctx.editMessageText(
		ctx.t('orders_list_message', {
			currentPage: page + 1,
			totalPages: Math.ceil(userOrders.totalCount / ORDERS_BUTTONS_PER_LINE),
			ordersList: userOrders.data
				.map((order, index) =>
					ctx.t('orders_list_chunk', {
						index: index + 1,
						orderId: order.id,
					}),
				)
				.join('\n'),
		}),
		{
			reply_markup: keyboard,
		},
	);
});
userExistsComposer.callbackQuery(ButtonPayload.Order.Regexp, async ctx => {
	const [, , rawOrderId] = ctx.callbackQuery.data.split('_');
	const orderId = Number(rawOrderId);
	if (isNaN(orderId)) return;

	const order = await orders.getByOrderId(orderId);
	if (!order)
		return await ctx.editMessageText(ctx.t('order_not_found', { orderId }), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MyOrders.Value(0))),
		});

	return await ctx.editMessageText(
		ctx.t('order_info', {
			...order,
			expireAt: formatTime(order.expireAt).format('HH:mm:ss, DD.MM.YY'),
			createdAt: formatTime(order.createdAt).format('HH:mm:ss, DD.MM.YY'),
		}),
		{
			reply_markup: new InlineKeyboard()
				.url(ctx.t('order_link_button'), order.link)
				.row()
				.add(getBackButton(ctx, ButtonPayload.MyOrders.Value(0))),
		},
	);
});
userExistsComposer.callbackQuery(ButtonPayload.Support, async ctx => {
	await ctx.editMessageText(ctx.t('support_message'), {
		reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
	});
});
userExistsComposer.command(
	'dev',
	async ctx =>
		await ctx.reply('Developer: https://t.me/zdev_tg', {
			link_preview_options: { is_disabled: true },
			reply_markup: new InlineKeyboard().url('Перейти', 'https://t.me/zdev_tg'),
		}),
);

userExistsComposer.on('pre_checkout_query', async ctx => {
	console.log(
		`[User ${ctx.user.id}] Pre checkout query payload: ${ctx.preCheckoutQuery.invoice_payload}`,
	);
	await ctx.answerPreCheckoutQuery(true);
});
userExistsComposer.on('message:successful_payment', async ctx => {
	const { successful_payment } = ctx.message;
	const subscriptionId = extractIdFromInvoicePayload(successful_payment.invoice_payload);
	if (!subscriptionId) return await ctx.reply(ctx.t('subscription_not_found'));

	const subscription = (await subscriptions.findById(subscriptionId))!;
	if (!subscription) return await ctx.reply(ctx.t('subscription_not_found'));

	const newProxyUser = await marzban.createUser(
		ctx.user.id,
		ctx.user.telegramId,
		ctx.user.username,
		subscription.durationInDays,
	);
	const order = await orders.create({
		amount: successful_payment.total_amount / 100,
		expireAt: new Date(newProxyUser.expire * 1000),
		link: newProxyUser.subscription_url,
		providerPaymentChargeId: successful_payment.provider_payment_charge_id,
		telegramPaymentChargeId: successful_payment.telegram_payment_charge_id,
		username: newProxyUser.username,
		title: subscription.title,
		user: { connect: { id: ctx.user.id } },
	});

	console.log(
		`[User ${ctx.user.id}] Buy subscription #${subscription.id} for ${
			successful_payment.total_amount / 100
		} ${successful_payment.currency}!`,
	);

	await ctx.reply(
		ctx.t('order_info', {
			id: order.id.toString(),
			username: order.username,
			createdAt: formatTime(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
			expireAt: formatTime(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
			link: order.link,
		}),
		{
			reply_markup: new InlineKeyboard()
				.url(ctx.t('order_link_button'), order.link)
				.row()
				.add(getBackButton(ctx, ButtonPayload.MyOrders.Value(0))),
		},
	);
});

const adminComposer = composer.filter(isAdminFilter);
adminComposer.callbackQuery(
	ButtonPayload.ControlPanel,
	async ctx =>
		await ctx.editMessageText(ctx.t('control_panel_message'), {
			reply_markup: getControlPanelKeyboard(ctx),
		}),
);
adminComposer.callbackQuery(ButtonPayload.EditSubscriptionsList.Regexp, async ctx => {
	const [, , rawPage] = ctx.callbackQuery.data.split('_');
	const page = parseInt(rawPage);
	if (isNaN(page)) return;
	// Нужно, чтобы после меню редактирвоания подписки, при выходе перекинуло на ту страницу, на которой был, а не в начало.
	ctx.session.editSubscriptionsPage = page;

	const subscriptionsList = await subscriptions.paginate(page, SUBSCRIPTIONS_PER_PAGE);
	if (!subscriptionsList)
		return await ctx.editMessageText(ctx.t('no_subscriptions_message'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});

	const keyboard = getPaginatedKeyboard({
		ctx,
		items: subscriptionsList.data,
		nextPage: subscriptionsList.nextPage,
		previousPage: subscriptionsList.previousPage,
		buttonsPerLine: SUBSCRIPTIONS_BUTTONS_PER_PAGE,
		getButtonTitle: (item, index) => (index + 1).toString(),
		getButtonPayload: (item, index) => ButtonPayload.EditSubscription.Value(item.id),
		getControlButtonsPayload: () => [
			ButtonPayload.EditSubscriptionsList.Value(subscriptionsList.previousPage || 0),
			ButtonPayload.EditSubscriptionsList.Value(subscriptionsList.nextPage || 0),
		],
		backButtonPayload: ButtonPayload.ControlPanel,
	});

	await ctx.editMessageText(
		ctx.t('subscriptions_list_message', {
			currentPage: page + 1,
			totalPages: Math.ceil(subscriptionsList.totalCount / SUBSCRIPTIONS_PER_PAGE),
			subscriptionsList: subscriptionsList.data
				.map((subscriptionsList, index) =>
					ctx.t('subscriptions_list_chunk', {
						index: index + 1,
						title: subscriptionsList.title,
					}),
				)
				.join('\n'),
		}),
		{
			reply_markup: keyboard,
		},
	);
});
adminComposer.callbackQuery(ButtonPayload.EditSubscription.Regexp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	const subscription = await subscriptions.findById(subscriptionId);
	if (!subscription)
		return await ctx.editMessageText(ctx.t('subscription_not_found'), {
			reply_markup: new InlineKeyboard().add(
				getBackButton(ctx, ButtonPayload.SubscriptionsList.Value(0)),
			),
		});

	const keyboard = new InlineKeyboard();
	keyboard.text(
		ctx.t('edit_subscription_title_button'),
		ButtonPayload.EditSubscriptionTitle.Value(subscriptionId),
	);
	keyboard.row();
	keyboard.text(
		ctx.t('edit_subscription_duration_button'),
		ButtonPayload.EditSubscriptionDuration.Value(subscriptionId),
	);
	keyboard.row();
	keyboard.text(
		ctx.t('edit_subscription_price_button'),
		ButtonPayload.EditSubscriptionPrice.Value(subscriptionId),
	);
	keyboard.row();
	keyboard.text(
		ctx.t('delete_subscription_button'),
		ButtonPayload.StartDeleteSubscription.Value(subscriptionId),
	);
	keyboard.row();
	keyboard.add(
		getBackButton(
			ctx,
			ButtonPayload.EditSubscriptionsList.Value(ctx.session.editSubscriptionsPage || 0),
		),
	);

	await ctx.editMessageText(
		ctx.t('edit_subscription_message', {
			...subscription,
			createdAt: formatTime(subscription.createdAt).format('HH:mm:ss, DD.MM.YY'),
		}),
		{ reply_markup: keyboard },
	);
});
adminComposer.callbackQuery(ButtonPayload.EditSubscriptionTitle.Regexp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	ctx.session.step = 'edit_subscription_title';
	ctx.session.subscriptionId = subscriptionId;
	ctx.session.messageId = ctx.callbackQuery.message?.message_id;

	await ctx.editMessageText(ctx.t('edit_subscription_title_message'), {
		reply_markup: new InlineKeyboard().add(
			getBackButton(
				ctx,
				ButtonPayload.EditSubscription.Value(subscriptionId),
				ctx.t('cancel_button'),
			),
		),
	});
});
adminComposer.callbackQuery(ButtonPayload.EditSubscriptionDuration.Regexp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	ctx.session.step = 'edit_subscription_duration';
	ctx.session.subscriptionId = subscriptionId;
	ctx.session.messageId = ctx.callbackQuery.message?.message_id;

	await ctx.editMessageText(ctx.t('edit_subscription_duration_message'), {
		reply_markup: new InlineKeyboard().add(
			getBackButton(
				ctx,
				ButtonPayload.EditSubscription.Value(subscriptionId),
				ctx.t('cancel_button'),
			),
		),
	});
});
adminComposer.callbackQuery(ButtonPayload.EditSubscriptionPrice.Regexp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	ctx.session.step = 'edit_subscription_price';
	ctx.session.subscriptionId = subscriptionId;
	ctx.session.messageId = ctx.callbackQuery.message?.message_id;

	await ctx.editMessageText(ctx.t('edit_subscription_price_message'), {
		reply_markup: new InlineKeyboard().add(
			getBackButton(
				ctx,
				ButtonPayload.EditSubscription.Value(subscriptionId),
				ctx.t('cancel_button'),
			),
		),
	});
});
adminComposer.callbackQuery(ButtonPayload.StartDeleteSubscription.RegExp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	return await ctx.editMessageText(ctx.t('delete_subscription_message', { subscriptionId }), {
		reply_markup: new InlineKeyboard()
			.text(ctx.t('yes_button'), ButtonPayload.AcceptDeleteSubscription.Value(subscriptionId))
			.add(
				getBackButton(
					ctx,
					ButtonPayload.EditSubscription.Value(subscriptionId),
					ctx.t('no_button'),
				),
			),
	});
});
adminComposer.callbackQuery(ButtonPayload.AcceptDeleteSubscription.RegExp, async ctx => {
	const [, , rawSubscribtionId] = ctx.callbackQuery.data.split('_');
	const subscriptionId = Number(rawSubscribtionId);
	if (isNaN(subscriptionId)) return;

	const isDeleted = await subscriptions.deleteById(subscriptionId);

	return await ctx.editMessageText(
		ctx.t(isDeleted ? 'subscription_deleted_message' : 'subscription_not_found', {
			subscriptionId,
		}),
		{
			reply_markup: new InlineKeyboard().add(
				getBackButton(
					ctx,
					ButtonPayload.EditSubscriptionsList.Value(ctx.session.editSubscriptionsPage || 0),
				),
			),
		},
	);
});
adminComposer.callbackQuery(ButtonPayload.CreateSubscription, async ctx => {
	ctx.session.step = 'subscription_ask_title';
	ctx.session.messageId = ctx.callbackQuery.message?.message_id;
	await ctx.editMessageText(ctx.t('ask_subscription_title'), {
		reply_markup: getCreateSubscriptionKeyboard(ctx),
	});
});
adminComposer.callbackQuery(ButtonPayload.GetBotTransactionsReport, async ctx => {
	const buffer = await orders.createReport();
	const file = new InputFile(
		Buffer.alloc(buffer.length, buffer),
		`report-${formatTime().format('DD-MM-YYYY')}.xlsx`,
	);
	await ctx.replyWithDocument(file, {
		caption: ctx.t('report_message'),
		protect_content: true,
		message_effect_id: '5104841245755180586',
	});
});
adminComposer.command('search', async ctx => {
	const [, rawUsername] = ctx.message?.text.split(' ') || [];
	if (!rawUsername)
		return await ctx.reply(ctx.t('user_orders_not_found'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});

	const username = rawUsername.replaceAll('@', '');
	const userOrders = await orders.getAllByTelegramUsername(username, 0, ORDERS_PER_PAGE);
	if (userOrders === null)
		return await ctx.reply(ctx.t('user_orders_not_found'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});
	const telegramId = userOrders.data[0].user.telegramId;
	const keyboard = getPaginatedKeyboard({
		ctx,
		items: [],
		backButtonPayload: ButtonPayload.MainMenu,
		buttonsPerLine: ORDERS_BUTTONS_PER_LINE,
		getButtonPayload: item => ``,
		getButtonTitle: (item, index) => ``,
		getControlButtonsPayload: () => [
			ButtonPayload.UserOrders.Value(telegramId, userOrders.previousPage || 0),
			ButtonPayload.UserOrders.Value(telegramId, userOrders.nextPage || 0),
		],
		previousPage: userOrders.previousPage,
		nextPage: userOrders.nextPage,
	});

	await ctx.reply(
		ctx.t('user_orders_list', {
			currentPage: 1,
			totalPages: Math.ceil(userOrders.totalCount / ORDERS_PER_PAGE).toString(),
			telegramId: telegramId.toString(),
			userOrdersList: userOrders.data
				.map((userOrder, index) =>
					ctx.t('user_orders_list_chunk', {
						index: (index + 1).toString(),
						key: userOrder.link,
					}),
				)
				.join('\n'),
		}),
		{ reply_markup: keyboard },
	);
});
adminComposer.callbackQuery(ButtonPayload.UserOrders.Regexp, async ctx => {
	const [, rawTelegramId, rawPage] = ctx.callbackQuery.data.split('_');
	if (!rawTelegramId)
		return await ctx.reply(ctx.t('user_orders_not_found'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});

	const page = Number(rawPage || 0);
	const telegramId = Number(rawTelegramId);

	const userOrders = await orders.getAllByTelegramUsername(
		telegramId.toString(),
		page,
		ORDERS_PER_PAGE,
	);
	if (userOrders === null)
		return await ctx.editMessageText(ctx.t('user_orders_not_found'), {
			reply_markup: new InlineKeyboard().add(getBackButton(ctx, ButtonPayload.MainMenu)),
		});

	const keyboard = getPaginatedKeyboard({
		ctx,
		items: [],
		backButtonPayload: ButtonPayload.MainMenu,
		buttonsPerLine: ORDERS_BUTTONS_PER_LINE,
		getButtonPayload: item => ``,
		getButtonTitle: (item, index) => ``,
		getControlButtonsPayload: () => [
			ButtonPayload.UserOrders.Value(telegramId, userOrders.previousPage || 0),
			ButtonPayload.UserOrders.Value(telegramId, userOrders.nextPage || 0),
		],
		previousPage: userOrders.previousPage,
		nextPage: userOrders.nextPage,
	});

	await ctx.editMessageText(
		ctx.t('user_orders_list', {
			currentPage: (page + 1).toString(),
			totalPages: Math.ceil(userOrders.totalCount / ORDERS_PER_PAGE).toString(),
			telegramId: telegramId.toString(),
			userOrdersList: userOrders.data
				.map((userOrder, index) =>
					ctx.t('user_orders_list_chunk', {
						index: (index + 1).toString(),
						key: userOrder.link,
					}),
				)
				.join('\n'),
		}),
		{ reply_markup: keyboard },
	);
});

composer.on('callback_query', async ctx => await ctx.answerCallbackQuery());

export { composer };
