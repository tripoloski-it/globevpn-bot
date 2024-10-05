import { Bot } from 'grammy';
import { TELEGRAM_BOT_TOKEN } from './config';
import { IContext } from '../types';

export const bot = new Bot<IContext>(TELEGRAM_BOT_TOKEN);
