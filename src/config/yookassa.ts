import { YooKassa } from 'yookassa-sdk';
import { YOOKASSA_SECRET, YOOKASSA_SHOP_ID } from './config';

export const yookassa = YooKassa({
	secret_key: YOOKASSA_SECRET,
	shop_id: YOOKASSA_SHOP_ID,
	debug: true,
});
