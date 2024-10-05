"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTIONS_BUTTONS_PER_PAGE = exports.SUBSCRIPTIONS_PER_PAGE = exports.ORDERS_BUTTONS_PER_LINE = exports.ORDERS_PER_PAGE = void 0;
__exportStar(require("./button-payload.constants"), exports);
exports.ORDERS_PER_PAGE = 9;
exports.ORDERS_BUTTONS_PER_LINE = 3;
exports.SUBSCRIPTIONS_PER_PAGE = 9;
exports.SUBSCRIPTIONS_BUTTONS_PER_PAGE = 3;
//# sourceMappingURL=index.js.map