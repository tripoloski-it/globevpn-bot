"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBackButton = void 0;
const grammy_1 = require("grammy");
const getBackButton = (ctx, payload, label) => grammy_1.InlineKeyboard.text(label ?? ctx.t('back_button'), payload);
exports.getBackButton = getBackButton;
//# sourceMappingURL=get-back.button.js.map