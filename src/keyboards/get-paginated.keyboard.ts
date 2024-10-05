import { InlineKeyboard } from 'grammy';
import { IContext } from '../types';

interface PaginatedKeyboardOptions<T> {
	readonly ctx: IContext;
	readonly items: T[];
	readonly buttonsPerLine: number;
	readonly getButtonPayload: (item: T, index: number) => string;
	readonly getButtonTitle: (item: T, index: number) => string;
	readonly nextPage: number | null;
	readonly previousPage: number | null;
	readonly backButtonPayload: string;
	readonly getControlButtonsPayload: () => [string, string];
}

export function getPaginatedKeyboard<T>({
	ctx,
	items,
	nextPage,
	previousPage,
	getButtonTitle,
	buttonsPerLine,
	backButtonPayload,
	getButtonPayload,
	getControlButtonsPayload,
}: PaginatedKeyboardOptions<T>): InlineKeyboard {
	const keyboard = new InlineKeyboard();

	items.forEach((item, index) => {
		keyboard.text(getButtonTitle(item, index), getButtonPayload(item, index));
		if ((index + 1) % buttonsPerLine === 0) keyboard.row();
	});

	keyboard.row();
	const [previousPagePayload, nextPagePayload] = getControlButtonsPayload();
	previousPage !== null && keyboard.text(ctx.t('previous_button'), previousPagePayload);
	nextPage !== null && keyboard.text(ctx.t('next_button'), nextPagePayload);

	keyboard.row();
	keyboard.text(ctx.t('back_button'), backButtonPayload);

	return keyboard;
}
