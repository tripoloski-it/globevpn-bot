"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getControlPanelKeyboard = void 0;
const grammy_1 = require("grammy");
const buttons_1 = require("../buttons");
const constants_1 = require("../constants");
const getControlPanelKeyboard = (ctx) => {
    const keyboard = new grammy_1.InlineKeyboard();
    keyboard.text(ctx.t('create_subscription_button'), constants_1.ButtonPayload.CreateSubscription).row();
    keyboard
        .text(ctx.t('edit_subscription_button'), constants_1.ButtonPayload.EditSubscriptionsList.Value(0))
        .row();
    keyboard
        .text(ctx.t('get_bot_transactions_report_button'), constants_1.ButtonPayload.GetBotTransactionsReport)
        .row();
    keyboard.add((0, buttons_1.getBackButton)(ctx, constants_1.ButtonPayload.MainMenu));
    return keyboard;
};
exports.getControlPanelKeyboard = getControlPanelKeyboard;
//# sourceMappingURL=get-control-panel.keyboard.js.map