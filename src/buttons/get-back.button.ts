import { InlineKeyboard } from 'grammy';
import { IContext } from '../types';

export const getBackButton = (ctx: IContext, payload: string, label?: string) =>
	InlineKeyboard.text(label ?? ctx.t('back_button'), payload);
