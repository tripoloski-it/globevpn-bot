"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionKeyboard = void 0;
const grammy_1 = require("grammy");
const buttons_1 = require("../buttons");
const constants_1 = require("../constants");
const getSubscriptionKeyboard = (ctx, url) => {
    const keyboard = new grammy_1.InlineKeyboard();
    keyboard.url(ctx.t('buy_button'), url).row();
    keyboard.add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.SubscriptionsList.Value(0)));
    return keyboard;
};
exports.getSubscriptionKeyboard = getSubscriptionKeyboard;
//# sourceMappingURL=get-subscription.keyboard.js.map