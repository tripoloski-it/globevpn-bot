"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUserToContextMiddleware = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
const insertUserToContextMiddleware = async (ctx, next) => {
    if (!ctx.from)
        return;
    const user = await services_1.users.findByTelegramId(ctx.from.id.toString());
    if (!user)
        return await next();
    if ((0, utils_1.isDefaultAdmin)(user.telegramId.toString()) && !user.isAdmin) {
        ctx.user = await services_1.users.updateById(user.id, { isAdmin: true });
    }
    if (!(0, utils_1.isDefaultAdmin)(user.telegramId.toString()) && user.isAdmin) {
        ctx.user = await services_1.users.updateById(user.id, { isAdmin: false });
    }
    ctx.user = ctx.user ?? user;
    ctx.isAdmin = ctx.user.isAdmin;
    return await next();
};
exports.insertUserToContextMiddleware = insertUserToContextMiddleware;
//# sourceMappingURL=insert-usert-to-context.middleware.js.map