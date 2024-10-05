"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("@grammyjs/i18n");
const config_1 = require("./config");
const path_1 = require("path");
const parse_mode_1 = require("@grammyjs/parse-mode");
const handlers_1 = require("./handlers");
const middlewares_1 = require("./middlewares");
const services_1 = require("./services");
const axios_1 = require("axios");
const grammy_1 = require("grammy");
const routers_1 = require("./routers");
const utils_1 = require("./utils");
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const ip_range_check_1 = __importDefault(require("ip-range-check"));
const yookassa_sdk_1 = require("yookassa-sdk");
async function bootstrap() {
    const i18n = new i18n_1.I18n({
        directory: (0, path_1.join)(process.cwd(), 'locales'),
        defaultLocale: 'ru',
        fluentBundleOptions: {
            useIsolating: false,
        },
        globalTranslationContext: ctx => {
            if (!ctx.from)
                return {};
            const username = ctx.from.first_name || `Пользователь#${ctx.user.id}`;
            return {
                username,
                userlink: `<a href="tg://user?id=${ctx.from.id}">${username}</a>`,
                date: (0, utils_1.formatTime)().format('HH:mm:ss:SSS, DD.MM.YYYY'),
            };
        },
    });
    function initialSessionData() {
        return {};
    }
    config_1.bot.use((0, grammy_1.session)({
        getSessionKey: ctx => `${ctx.chat?.id}:${ctx.from?.id}`,
        initial: initialSessionData,
    }));
    config_1.bot.use(middlewares_1.autoAnswerCallbackQueryMiddleware);
    config_1.bot.use(parse_mode_1.hydrateReply);
    config_1.bot.use(middlewares_1.insertUserToContextMiddleware);
    config_1.bot.use(i18n);
    config_1.bot.use(...routers_1.routers);
    config_1.bot.use(handlers_1.composer);
    config_1.bot.api.config.use((0, parse_mode_1.parseMode)('HTML'));
    config_1.bot.start({
        drop_pending_updates: true,
        onStart: botInfo => console.log(`Bot @${botInfo.username} started!`),
    });
    config_1.bot.catch(async ({ error, ctx }) => {
        if (error instanceof axios_1.AxiosError) {
            console.error(`[${error.name}] Status: ${error.response?.status || null}. ${error.message}`);
        }
        else if (error instanceof yookassa_sdk_1.YooKassaErr) {
            console.error(`[${error.name}] ${error.message}`);
        }
        else if (error instanceof Error) {
            console.error(`[${error.name}] ${error.message}\n${error.stack}`);
        }
        else {
            console.error(error);
        }
        return ctx.reply('An error has occurred!').catch(console.error);
    });
    await config_1.prisma.$connect();
    console.log(`Connected to database!`);
    await services_1.marzban.authorize();
    console.log(`Marzban authorized`);
    const app = (0, express_1.default)();
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json({}));
    app.get('/', (req, res) => res.json({ time: Date.now(), status: 'OK' }));
    app.post('/payments/yookassa', async (req, res) => {
        const ip = req.header('X-Real-IP')?.toString() || req.ip?.toString() || '';
        if (!(0, ip_range_check_1.default)(ip, config_1.YOOKASSA_IPS)) {
            console.log('Invalid yookassa IP:', ip);
            return res.sendStatus(403);
        }
        const { type, event, object } = req.body;
        if (type !== 'notification')
            return res.sendStatus(404);
        if (event !== 'payment.succeeded')
            return res.sendStatus(200);
        const { metadata: { subscriptionId, messageId, telegramId }, amount: { value: amountValue }, } = object;
        const subscription = (await services_1.subscriptions.findById(parseInt(subscriptionId)));
        if (!subscription)
            return res.sendStatus(404);
        res.sendStatus(200);
        const user = (await services_1.users.findByTelegramId(telegramId));
        const newProxyUser = await services_1.marzban.createUser(user.id, user.telegramId, user.username, subscription.durationInDays);
        const order = await services_1.orders.create({
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
        await config_1.bot.api
            .editMessageText(user.telegramId, parseInt(messageId), i18n.t('ru', 'order_info', {
            id: order.id.toString(),
            username: order.username,
            createdAt: (0, utils_1.formatTime)(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
            expireAt: (0, utils_1.formatTime)(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
            link: order.link,
        }), {
            reply_markup: new grammy_1.InlineKeyboard()
                .url(i18n.t('ru', 'order_link_button'), order.link)
                .row()
                .text(i18n.t('ru', 'back_button'), constants_1.ButtonPayload.MyOrders.Value(0)),
        })
            .catch(async (error) => {
            console.error('Edit payment msg error: ', error);
            await config_1.bot.api.sendMessage(user.telegramId, i18n.t('ru', 'order_info', {
                id: order.id.toString(),
                username: order.username,
                createdAt: (0, utils_1.formatTime)(order.createdAt).format('HH:mm:ss, DD.MM.YYYY'),
                expireAt: (0, utils_1.formatTime)(order.expireAt).format('HH:mm:ss, DD.MM.YYYY'),
                link: order.link,
            }), {
                reply_markup: new grammy_1.InlineKeyboard()
                    .url(i18n.t('ru', 'order_link_button'), order.link)
                    .row()
                    .text(i18n.t('ru', 'back_button'), constants_1.ButtonPayload.MyOrders.Value(0)),
            });
        })
            .catch(error => console.error(`Can't send payment message: `, error));
    });
    app.listen(config_1.SERVER_PORT, () => console.log('Server listen', config_1.SERVER_PORT, 'port.'));
}
bootstrap();
//# sourceMappingURL=index.js.map