import { IContext } from '../types';

export const isUserNotExistFilter = (ctx: IContext) => typeof ctx.user === 'undefined';
