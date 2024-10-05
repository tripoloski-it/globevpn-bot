"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractIdFromInvoicePayload = exports.createInvoicePayload = void 0;
const createInvoicePayload = (subscriptionId) => `sub:${subscriptionId}`;
exports.createInvoicePayload = createInvoicePayload;
const extractIdFromInvoicePayload = (payload) => {
    const [, rawId] = payload.split(':');
    const id = parseInt(rawId);
    return isNaN(id) ? null : id;
};
exports.extractIdFromInvoicePayload = extractIdFromInvoicePayload;
//# sourceMappingURL=invoice-payload.utils.js.map