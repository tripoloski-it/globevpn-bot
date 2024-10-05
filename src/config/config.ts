import { config } from 'dotenv';

config({});

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const OWNER_IDS =
	process.env.OWNER_IDS?.split(',').map(telegramId => telegramId.trim()) || [];
export const MARZBAN_BASE_URL = process.env.MARZBAN_BASE_URL || '';
export const MARZBAN_USERNAME = process.env.MARZBAN_USERNAME || '';
export const MARZBAN_PASSWORD = process.env.MARZBAN_PASSWORD || '';
export const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID || '';
export const YOOKASSA_SECRET = process.env.YOOKASSA_SECRET || '';
export const SERVER_PORT = process.env.SERVER_PORT || 8443;
export const YOOKASSA_IPS = [
	'185.71.76.0/27',
	'185.71.77.0/27',
	'77.75.153.0/25',
	'77.75.156.11',
	'77.75.156.35',
	'77.75.154.128/25',
	'2a02:5180::/32',
];

export const YOOKASSA_TOKEN = process.env.YOOKASSA_TOKEN || '';
