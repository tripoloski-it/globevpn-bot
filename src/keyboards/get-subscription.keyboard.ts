import { InlineKeyboard } from 'grammy';
import { IContext } from '../types';
import { getBackButton } from '../buttons';
import { ButtonPayload } from '../constants';

export const getSubscriptionKeyboard = (ctx: IContext, url: string) => {
	const keyboard = new InlineKeyboard();

	keyboard.url(ctx.t('buy_button'), url).row();

	keyboard.add(getBackButton(ctx, ButtonPayload.SubscriptionsList.Value(0)));

	return keyboard;
};
