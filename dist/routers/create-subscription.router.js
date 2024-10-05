"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubsRouter = void 0;
const router_1 = require("@grammyjs/router");
const grammy_1 = require("grammy");
const constants_1 = require("../constants");
const keyboards_1 = require("../keyboards");
const services_1 = require("../services");
const buttons_1 = require("../buttons");
const router = new router_1.Router(ctx => ctx.session.step);
exports.createSubsRouter = router;
async function cancelActionHandler(ctx, next) {
    ctx.session = {};
    return await next();
}
const title = router.route('subscription_ask_title');
title.callbackQuery(constants_1.ButtonPayload.ControlPanel, cancelActionHandler);
title.on('message:text', async (ctx) => {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);
    ctx.session.title = ctx.message.text;
    ctx.session.step = 'subscription_ask_duration';
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('ask_subscription_duration'), {
        reply_markup: (0, keyboards_1.getCreateSubscriptionKeyboard)(ctx),
    });
});
const duration = router.route('subscription_ask_duration');
duration.callbackQuery(constants_1.ButtonPayload.ControlPanel, cancelActionHandler);
duration.on('message:text', async (ctx) => {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);
    const durationInDays = parseInt(ctx.message?.text);
    if (isNaN(durationInDays) || durationInDays < 1) {
        await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('ask_subscription_duration'), {
            reply_markup: (0, keyboards_1.getCreateSubscriptionKeyboard)(ctx),
        });
        return;
    }
    ctx.session.durationInDays = durationInDays;
    ctx.session.step = 'subscription_ask_price';
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('ask_subscription_price'), {
        reply_markup: (0, keyboards_1.getCreateSubscriptionKeyboard)(ctx),
    });
});
const price = router.route('subscription_ask_price');
price.callbackQuery(constants_1.ButtonPayload.ControlPanel, cancelActionHandler);
price.on('message:text', async (ctx) => {
    await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id);
    const price = parseFloat(ctx.message?.text);
    if (isNaN(price) || price < 100) {
        await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('ask_subscription_price'), {
            reply_markup: (0, keyboards_1.getCreateSubscriptionKeyboard)(ctx),
        });
        return;
    }
    const { durationInDays, title } = ctx.session;
    const subscription = await services_1.subscriptions.create({
        durationInDays,
        title,
        price,
        createdBy: { connect: { id: ctx.user.id } },
    });
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_created_message', { subscriptionId: subscription.id }), {
        reply_markup: new grammy_1.InlineKeyboard()
            .text(ctx.t('open_subscription_button', { subscriptionId: subscription.id }), constants_1.ButtonPayload.EditSubscription.Value(subscription.id))
            .row()
            .add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.ControlPanel)),
    });
    ctx.session = {};
});
//# sourceMappingURL=create-subscription.router.js.map