import { InlineKeyboard } from 'grammy';
import { IContext } from '../types';
import { ButtonPayload } from '../constants';

export const getCreateSubscriptionKeyboard = (ctx: IContext) => {
	return new InlineKeyboard().text(ctx.t('cancel_button'), ButtonPayload.ControlPanel);
};
