export declare const ButtonPayload: {
    MainMenu: string;
    Cancel: string;
    DeleteMessage: string;
    ControlPanel: string;
    CreateSubscription: string;
    EditSubscriptionsList: {
        Regexp: RegExp;
        Value: (page: number) => string;
    };
    EditSubscription: {
        Regexp: RegExp;
        Value: (subscribtionId: number) => string;
    };
    StartDeleteSubscription: {
        RegExp: RegExp;
        Value: (subscribtionId: number) => string;
    };
    AcceptDeleteSubscription: {
        RegExp: RegExp;
        Value: (subscribtionId: number) => string;
    };
    EditSubscriptionTitle: {
        Regexp: RegExp;
        Value: (subscriptionId: number) => string;
    };
    EditSubscriptionPrice: {
        Regexp: RegExp;
        Value: (subscriptionId: number) => string;
    };
    EditSubscriptionDuration: {
        Regexp: RegExp;
        Value: (subscriptionId: number) => string;
    };
    GetBotTransactionsReport: string;
    SubscriptionsList: {
        Regexp: RegExp;
        Value: (page?: number) => string;
    };
    SubscriptionMenu: {
        Regexp: RegExp;
        Value: (subscriptionId: number) => string;
    };
    MyOrders: {
        Regexp: RegExp;
        Value: (page?: number) => string;
    };
    Order: {
        Regexp: RegExp;
        Value: (orderId: number) => string;
    };
    Support: string;
    UserOrders: {
        Regexp: RegExp;
        Value: (telegramId: string | number, page: number) => string;
    };
};
//# sourceMappingURL=button-payload.constants.d.ts.map