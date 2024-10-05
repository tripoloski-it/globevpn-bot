"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainMenuKEyboard = void 0;
const grammy_1 = require("grammy");
const constants_1 = require("../constants");
const getMainMenuKEyboard = (ctx) => {
    const keyboard = new grammy_1.InlineKeyboard();
    ctx.user.isAdmin &&
        keyboard.text(ctx.t('control_panel_button'), constants_1.ButtonPayload.ControlPanel).row();
    keyboard.text(ctx.t('subscriptions_list_button'), constants_1.ButtonPayload.SubscriptionsList.Value(0)).row();
    keyboard.text(ctx.t('my_orders_button'), constants_1.ButtonPayload.MyOrders.Value()).row();
    keyboard.text(ctx.t('support_button'), constants_1.ButtonPayload.Support);
    return keyboard;
};
exports.getMainMenuKEyboard = getMainMenuKEyboard;
//# sourceMappingURL=get-main-menu-keyboard.js.map