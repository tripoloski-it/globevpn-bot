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
export declare function getPaginatedKeyboard<T>({ ctx, items, nextPage, previousPage, getButtonTitle, buttonsPerLine, backButtonPayload, getButtonPayload, getControlButtonsPayload, }: PaginatedKeyboardOptions<T>): InlineKeyboard;
export {};
//# sourceMappingURL=get-paginated.keyboard.d.ts.map