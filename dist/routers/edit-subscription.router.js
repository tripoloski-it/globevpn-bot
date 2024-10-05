"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subsRouter = void 0;
const router_1 = require("@grammyjs/router");
const grammy_1 = require("grammy");
const buttons_1 = require("../buttons");
const constants_1 = require("../constants");
const services_1 = require("../services");
const router = new router_1.Router(ctx => ctx.session.step);
exports.subsRouter = router;
const cancelActionHandler = async (ctx, next) => {
    ctx.session = {};
    return await next();
};
const editSubscriptionTitleRouter = router.route('edit_subscription_title');
editSubscriptionTitleRouter.on('message:text', async (ctx) => {
    await ctx.deleteMessage();
    const subscriptionId = ctx.session.subscriptionId;
    const keyboard = new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId)));
    const subscription = await services_1.subscriptions.findById(subscriptionId);
    if (!subscription) {
        await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_not_found'), { reply_markup: keyboard });
        ctx.session = {};
        return;
    }
    const title = ctx.message.text;
    await services_1.subscriptions.updateById(subscriptionId, { title });
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_data_updated_message'), {
        reply_markup: new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId))),
    });
    ctx.session = {};
});
editSubscriptionTitleRouter.callbackQuery(constants_1.ButtonPayload.EditSubscription.Regexp, cancelActionHandler);
const editSubscriptionDurationRouter = router.route('edit_subscription_duration');
editSubscriptionDurationRouter.on('message:text', async (ctx) => {
    await ctx.deleteMessage();
    const subscriptionId = ctx.session.subscriptionId;
    const keyboard = new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId)));
    const subscription = await services_1.subscriptions.findById(subscriptionId);
    if (!subscription) {
        await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_not_found'), { reply_markup: keyboard });
        ctx.session = {};
        return;
    }
    const durationInDays = parseInt(ctx.message?.text);
    if (isNaN(durationInDays) || durationInDays < 1) {
        await ctx.api.deleteMessage(ctx.chat.id, ctx.session.messageId);
        const message = await ctx.reply(ctx.t('edit_subscription_duration_message'), {
            reply_markup: new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId), ctx.t('cancel_button'))),
        });
        ctx.session.messageId = message.message_id;
        return;
    }
    await services_1.subscriptions.updateById(subscriptionId, { durationInDays });
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_data_updated_message'), {
        reply_markup: new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId))),
    });
    ctx.session = {};
});
editSubscriptionDurationRouter.callbackQuery(constants_1.ButtonPayload.EditSubscription.Regexp, cancelActionHandler);
const editSubscriptionPriceRouter = router.route('edit_subscription_price');
editSubscriptionPriceRouter.on('message:text', async (ctx) => {
    await ctx.deleteMessage();
    const subscriptionId = ctx.session.subscriptionId;
    const keyboard = new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId)));
    const subscription = await services_1.subscriptions.findById(subscriptionId);
    if (!subscription) {
        await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_not_found'), { reply_markup: keyboard });
        ctx.session = {};
        return;
    }
    const price = parseFloat(ctx.message?.text);
    if (isNaN(price) || price < 100) {
        await ctx.api.deleteMessage(ctx.chat.id, ctx.session.messageId);
        const message = await ctx.reply(ctx.t('edit_subscription_price_message'), {
            reply_markup: new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId), ctx.t('cancel_button'))),
        });
        ctx.session.messageId = message.message_id;
        return;
    }
    await services_1.subscriptions.updateById(subscriptionId, { price });
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('subscription_data_updated_message'), {
        reply_markup: new grammy_1.InlineKeyboard().add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.EditSubscription.Value(subscriptionId))),
    });
    ctx.session = {};
});
editSubscriptionPriceRouter.callbackQuery(constants_1.ButtonPayload.EditSubscription.Regexp, cancelActionHandler);
//# sourceMappingURL=edit-subscription.router.js.map