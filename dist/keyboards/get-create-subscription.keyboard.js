"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreateSubscriptionKeyboard = void 0;
const grammy_1 = require("grammy");
const constants_1 = require("../constants");
const getCreateSubscriptionKeyboard = (ctx) => {
    return new grammy_1.InlineKeyboard().text(ctx.t('cancel_button'), constants_1.ButtonPayload.ControlPanel);
};
exports.getCreateSubscriptionKeyboard = getCreateSubscriptionKeyboard;
//# sourceMappingURL=get-create-subscription.keyboard.js.map