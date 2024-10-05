import { I18nFlavor } from '@grammyjs/i18n';
import { ParseModeFlavor } from '@grammyjs/parse-mode';
import { Users } from '@prisma/client';
import { Context, SessionFlavor } from 'grammy';

interface ISessionData {
	step?: string;
	editSubscriptionsPage?: number;
	payment?: string;
	[key: string]: any;
}

export type IContext = Context &
	ParseModeFlavor<Context> &
	SessionFlavor<ISessionData> &
	I18nFlavor & {
		isAdmin: boolean;
		user: Users;
	};
