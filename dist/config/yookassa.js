"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yookassa = void 0;
const yookassa_sdk_1 = require("yookassa-sdk");
const config_1 = require("./config");
exports.yookassa = (0, yookassa_sdk_1.YooKassa)({
    secret_key: config_1.YOOKASSA_SECRET,
    shop_id: config_1.YOOKASSA_SHOP_ID,
    debug: true,
});
//# sourceMappingURL=yookassa.js.map