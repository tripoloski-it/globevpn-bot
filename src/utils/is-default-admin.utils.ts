import { OWNER_IDS } from '../config';

export const isDefaultAdmin = (telegramId: string) => OWNER_IDS.includes(telegramId);
