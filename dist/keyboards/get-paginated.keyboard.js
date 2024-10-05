"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedKeyboard = getPaginatedKeyboard;
const grammy_1 = require("grammy");
function getPaginatedKeyboard({ ctx, items, nextPage, previousPage, getButtonTitle, buttonsPerLine, backButtonPayload, getButtonPayload, getControlButtonsPayload, }) {
    const keyboard = new grammy_1.InlineKeyboard();
    items.forEach((item, index) => {
        keyboard.text(getButtonTitle(item, index), getButtonPayload(item, index));
        if ((index + 1) % buttonsPerLine === 0)
            keyboard.row();
    });
    keyboard.row();
    const [previousPagePayload, nextPagePayload] = getControlButtonsPayload();
    previousPage !== null && keyboard.text(ctx.t('previous_button'), previousPagePayload);
    nextPage !== null && keyboard.text(ctx.t('next_button'), nextPagePayload);
    keyboard.row();
    keyboard.text(ctx.t('back_button'), backButtonPayload);
    return keyboard;
}
//# sourceMappingURL=get-paginated.keyboard.js.map