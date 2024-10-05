"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routers = void 0;
const create_subscription_router_1 = require("./create-subscription.router");
const edit_subscription_router_1 = require("./edit-subscription.router");
const register_user_router_1 = require("./register-user.router");
exports.routers = [create_subscription_router_1.createSubsRouter, edit_subscription_router_1.subsRouter, register_user_router_1.registerUserRouter];
//# sourceMappingURL=index.js.map