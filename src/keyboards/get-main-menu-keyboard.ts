import { InlineKeyboard } from 'grammy';
import { IContext } from '../types';
import { ButtonPayload } from '../constants';

export const getMainMenuKEyboard = (ctx: IContext) => {
	const keyboard = new InlineKeyboard();

	ctx.user.isAdmin &&
		keyboard.text(ctx.t('control_panel_button'), ButtonPayload.ControlPanel).row();
	keyboard.text(ctx.t('subscriptions_list_button'), ButtonPayload.SubscriptionsList.Value(0)).row();
	keyboard.text(ctx.t('my_orders_button'), ButtonPayload.MyOrders.Value()).row();
	keyboard.text(ctx.t('support_button'), ButtonPayload.Support);

	return keyboard;
};
