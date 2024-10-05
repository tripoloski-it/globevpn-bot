export const createInvoicePayload = (subscriptionId: number) => `sub:${subscriptionId}`;

export const extractIdFromInvoicePayload = (payload: string) => {
	const [, rawId] = payload.split(':');
	const id = parseInt(rawId);
	return isNaN(id) ? null : id;
};
