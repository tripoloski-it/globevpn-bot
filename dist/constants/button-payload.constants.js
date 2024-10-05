"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonPayload = void 0;
exports.ButtonPayload = {
    MainMenu: 'main_menu',
    Cancel: 'cancel',
    DeleteMessage: 'delete_message',
    ControlPanel: 'control_panel',
    CreateSubscription: 'create_subscription',
    EditSubscriptionsList: {
        Regexp: /edit_subscriptions_(\d+)/i,
        Value: (page) => `edit_subscriptions_${page}`,
    },
    EditSubscription: {
        Regexp: /edit_subscription_(\d)+/i,
        Value: (subscribtionId) => `edit_subscription_${subscribtionId}`,
    },
    StartDeleteSubscription: {
        RegExp: /delete_subscription_(\d+)/i,
        Value: (subscribtionId) => `delete_subscription_${subscribtionId}`,
    },
    AcceptDeleteSubscription: {
        RegExp: /accept_subscription_(\d+)/i,
        Value: (subscribtionId) => `accept_subscription_${subscribtionId}`,
    },
    EditSubscriptionTitle: {
        Regexp: /edt_title_(\d+)/i,
        Value: (subscriptionId) => `edt_title_${subscriptionId}`,
    },
    EditSubscriptionPrice: {
        Regexp: /edt_price_(\d+)/i,
        Value: (subscriptionId) => `edt_price_${subscriptionId}`,
    },
    EditSubscriptionDuration: {
        Regexp: /edt_duration_(\d+)/i,
        Value: (subscriptionId) => `edt_duration_${subscriptionId}`,
    },
    GetBotTransactionsReport: 'get_bot_transactions',
    SubscriptionsList: {
        Regexp: /subscriptions_list_(\d+)/i,
        Value: (page = 0) => `subscriptions_list_${page}`,
    },
    SubscriptionMenu: {
        Regexp: /subscription_menu_(\d+)/i,
        Value: (subscriptionId) => `subscription_menu_${subscriptionId}`,
    },
    MyOrders: {
        Regexp: /^my_orders_(\d+)$/i,
        Value: (page = 0) => `my_orders_${page}`,
    },
    Order: {
        Regexp: /order_info_(\d+)/i,
        Value: (orderId) => `order_info_${orderId}`,
    },
    Support: 'support',
    UserOrders: {
        Regexp: /orders_(\d+)_(\d+)/i,
        Value: (telegramId, page) => `orders_${telegramId}_${page}`,
    },
};
//# sourceMappingURL=button-payload.constants.js.map