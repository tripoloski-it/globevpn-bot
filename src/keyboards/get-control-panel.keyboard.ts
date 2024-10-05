import { InlineKeyboard } from 'grammy';
import { IContext } from '../types';
import { getBackButton } from '../buttons';
import { ButtonPayload } from '../constants';

export const getControlPanelKeyboard = (ctx: IContext) => {
	const keyboard = new InlineKeyboard();

	keyboard.text(ctx.t('create_subscription_button'), ButtonPayload.CreateSubscription).row();
	keyboard
		.text(ctx.t('edit_subscription_button'), ButtonPayload.EditSubscriptionsList.Value(0))
		.row();
	keyboard
		.text(ctx.t('get_bot_transactions_report_button'), ButtonPayload.GetBotTransactionsReport)
		.row();

	keyboard.add(getBackButton(ctx, ButtonPayload.MainMenu));

	return keyboard;
};
