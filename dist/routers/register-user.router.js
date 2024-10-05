"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserRouter = void 0;
const router_1 = require("@grammyjs/router");
const constants_1 = require("../constants");
const grammy_1 = require("grammy");
const deep_email_validator_1 = require("deep-email-validator");
const services_1 = require("../services");
const utils_1 = require("../utils");
const router = new router_1.Router(ctx => ctx.session.step);
exports.registerUserRouter = router;
const askUserEmail = router.route('ask_user_email');
askUserEmail.on('message:text', async (ctx) => {
    await ctx.deleteMessage();
    const email = ctx.message.text;
    const { valid, validators, reason } = await (0, deep_email_validator_1.validate)(email);
    if (!valid ||
        (reason && !validators[reason]?.reason?.includes('run out of space'))) {
        console.info('Invalid email:', email.slice(0, 65), reason ? validators[reason]?.reason : validators);
        return await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('invalid_user_email_message'), {
            reply_markup: new grammy_1.InlineKeyboard().text(ctx.t('cancel_button'), constants_1.ButtonPayload.Cancel),
        });
    }
    await services_1.users.findOrCreate(ctx.from.id.toString(), email, ctx.from.username, (0, utils_1.isDefaultAdmin)(ctx.from.id.toString()));
    await ctx.api.editMessageText(ctx.chat.id, ctx.session.messageId, ctx.t('email_saved_message'), {
        reply_markup: new grammy_1.InlineKeyboard().text(ctx.t('main_menu_button'), constants_1.ButtonPayload.MainMenu),
    });
    ctx.session = {};
});
askUserEmail.callbackQuery(constants_1.ButtonPayload.Cancel, async (ctx) => {
    ctx.session = {};
    await ctx.editMessageText(ctx.t('start_message'), {
        reply_markup: new grammy_1.InlineKeyboard().text(ctx.t('start_button'), constants_1.ButtonPayload.MainMenu),
    });
});
//# sourceMappingURL=register-user.router.js.map