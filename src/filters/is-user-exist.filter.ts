import { IContext } from '../types';

export const isUserExistFilter = async (ctx: IContext) => !!ctx.user;
