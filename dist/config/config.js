"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YOOKASSA_TOKEN = exports.YOOKASSA_IPS = exports.SERVER_PORT = exports.YOOKASSA_SECRET = exports.YOOKASSA_SHOP_ID = exports.MARZBAN_PASSWORD = exports.MARZBAN_USERNAME = exports.MARZBAN_BASE_URL = exports.OWNER_IDS = exports.DATABASE_URL = exports.TELEGRAM_BOT_TOKEN = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({});
exports.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
exports.DATABASE_URL = process.env.DATABASE_URL || '';
exports.OWNER_IDS = process.env.OWNER_IDS?.split(',').map(telegramId => telegramId.trim()) || [];
exports.MARZBAN_BASE_URL = process.env.MARZBAN_BASE_URL || '';
exports.MARZBAN_USERNAME = process.env.MARZBAN_USERNAME || '';
exports.MARZBAN_PASSWORD = process.env.MARZBAN_PASSWORD || '';
exports.YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID || '';
exports.YOOKASSA_SECRET = process.env.YOOKASSA_SECRET || '';
exports.SERVER_PORT = process.env.SERVER_PORT || 8443;
exports.YOOKASSA_IPS = [
    '185.71.76.0/27',
    '185.71.77.0/27',
    '77.75.153.0/25',
    '77.75.156.11',
    '77.75.156.35',
    '77.75.154.128/25',
    '2a02:5180::/32',
];
exports.YOOKASSA_TOKEN = process.env.YOOKASSA_TOKEN || '';
//# sourceMappingURL=config.js.map