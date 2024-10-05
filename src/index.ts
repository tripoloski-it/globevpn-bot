import { I18n } from '@grammyjs/i18n';
import { bot, prisma, SERVER_PORT, YOOKASSA_IPS } from './config';
import { join } from 'path';
import { IContext } from './types';
import { FluentVariable } from '@grammyjs/i18n/script/src/deps';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { composer } from './handlers';
import { autoAnswerCallbackQueryMiddleware, insertUserToContextMiddleware } from './middlewares';
import { marzban, orders, subscriptions, users } from './services';
import { AxiosError } from 'axios';
import { InlineKeyboard, session } from 'grammy';
import { routers } from './routers';
import { formatTime } from './utils';
import express from 'express';
import { ButtonPayload } from './constants';
import ipRangeCheck from 'ip-range-check';
import e from 'express';
import { YooKassaErr } from 'yookassa-sdk';

async function bootstrap() {
	const i18n = new I18n<IContext>({
		directory: join(process.cwd(), 'locales'),
		defaultLocale: 'ru',
		fluentBundleOptions: {
			useIsolating: false,
		},
		globalTranslationContext: ctx => {
			if (!ctx.from) return {} as Record<string, FluentVariable>;
			const username = ctx.from.first_name || `Пользователь#${ctx.user.id}`;
			return {
				username,
				userlink: `<a href="tg://user?id=${ctx.from.id}">${username}</a>`,
				date: formatTime().format('HH:mm:ss:SSS, DD.MM.YYYY'),
			};
		},
	});

	function initialSessionData() {
		return {};
	}

	bot.use(
		session({
			getSessionKey: ctx => `${ctx.chat?.id}:${ctx.from?.id}`,
			initial: initialSessionData,
		}),
	);
	bot.use(autoAnswerCallbackQueryMiddleware);
	bot.use(hydrateReply);
	bot.use(insertUserToContextMiddleware);
	bot.use(i18n);
	bot.use(...routers);
	bot.use(composer);

	bot.api.config.use(parseMode('HTML'));
	bot.start({
		drop_pending_updates: true,
		onStart: botInfo => console.log(`Bot @${botInfo.username} started!`),
	});
	bot.catch(async ({ error, ctx }) => {
		if (error instanceof AxiosError) {
			console.error(`[${error.name}] Status: ${error.response?.status || null}. ${error.message}`);
		} else if (error instanceof YooKassaErr) {
			console.error(`[${error.name}] ${error.message}`);
		} else if (error instanceof Error) {
			console.error(`[${error.name}] ${error.message}\n${error.stack}`);
		} else {
			console.error(error);
		}
		return ctx.reply('An error has occurred!').catch(console.error);
	});

	await prisma.$connect();
	console.log(`Connected to database!`);

	await marzban.authorize();
	console.log(`Marzban authorized`);

	const app = express();

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json({}));

	app.get('/', (req: e.Request, res: e.Response) => res.json({ time: Date.now(), status: 'OK' }));

	app.post('/payments/yookassa', async (req: e.Request, res: e.Response) => {
		const ip = req.header('X-Real-IP')?.toString() || req.ip?.toString() || '';
		if (!ipRangeCheck(ip, YOOKASSA_IPS)) {
			console.log('Invalid yookassa IP:', ip);
			return res.sendStatus(403);
		}

		const { type, event, object } = req.body;
		if (type !== 'notification') return res.sendStatus(404);
		if (event !== 'payment.succeeded') return res.sendStatus(200);

		const {
			metadata: { subscriptionId, messageId, telegramId },
			amount: { value: amountValue },
		} = object;

		const subscription = (await subscriptions.findById(parseInt(subscriptionId)))!;
		if (!subscription) return res.sendStatus(404);

		res.sendStatus(200);

		const user = (await users.findByTelegramId(telegramId))!;

		const newProxyUser = await marzban.createUser(
			user.id,
			user.telegramId,
			user.username,
			subscription.durationInDays,
		);
		const order = await orders.create({
			amount: parseFloat(amountValue),
			expireAt: new Date(newProxyUser.expire * 1000),
			link: newProxyUser.subscription_url,
			providerPaymentChargeId: 'YOOKASSA',
			telegramPaymentChargeId: '-',
			username: newProxyUser.username,
			title: subscription.title,
			user: { connect: { id: user.id } },
		});

		console.log(`[User ${user.id}] Buy subscription #${subscription.id} for ${amountValue} RUB!`);

		await bot.api
			.editMessageText(
				user.telegramId,
				parseInt(messageId),
				i18n.t('ru', 'order_info', {
					id: order.id.toString(),
					username: order.username,
					createdAt: formatTime(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
					expireAt: formatTime(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
					link: order.link,
				}),
				{
					reply_markup: new InlineKeyboard()
						.url(i18n.t('ru', 'order_link_button'), order.link)
						.row()
						.text(i18n.t('ru', 'back_button'), ButtonPayload.MyOrders.Value(0)),
				},
			)
			.catch(async error => {
				console.error('Edit payment msg error: ', error);
				await bot.api.sendMessage(
					user.telegramId,
					i18n.t('ru', 'order_info', {
						id: order.id.toString(),
						username: order.username,
						createdAt: formatTime(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
						expireAt: formatTime(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
						link: order.link,
					}),
					{
						reply_markup: new InlineKeyboard()
							.url(i18n.t('ru', 'order_link_button'), order.link)
							.row()
							.text(i18n.t('ru', 'back_button'), ButtonPayload.MyOrders.Value(0)),
					},
				);
			})
			.catch(error => console.error(`Can't send payment message: `, error));
	});

	app.listen(SERVER_PORT, () => console.log('Server listen', SERVER_PORT, 'port.'));
}

bootstrap();
