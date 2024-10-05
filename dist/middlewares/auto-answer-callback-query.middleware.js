"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoAnswerCallbackQueryMiddleware = void 0;
const autoAnswerCallbackQueryMiddleware = async (ctx, next) => {
    let called = false;
    ctx.api.config.use((prev, method, payload, signal) => {
        if (method === 'answerCallbackQuery')
            called = true;
        return prev(method, payload, signal);
    });
    try {
        return await next();
    }
    finally {
        if (ctx.callbackQuery && !called) {
            await ctx.answerCallbackQuery().catch(() => { });
        }
    }
};
exports.autoAnswerCallbackQueryMiddleware = autoAnswerCallbackQueryMiddleware;
//# sourceMappingURL=auto-answer-callback-query.middleware.js.map