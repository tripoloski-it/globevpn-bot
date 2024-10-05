import { IAuthorizeResponse, ICreateUserResponse } from '../types';
declare class Marzban {
    private username;
    private password;
    private token?;
    private client;
    private tokenHeader;
    constructor(username: string, password: string);
    authorize(): Promise<IAuthorizeResponse>;
    currentAdmin(): Promise<any>;
    createUser(userId: number, telegramId: string, username: string | null, durationInDays: number): Promise<ICreateUserResponse>;
    removeUser(username: string): Promise<boolean>;
    private createUserData;
    private generateUsername;
    private getExpireDuration;
    private getAuthData;
    private init;
}
export declare const marzban: Marzban;
export {};
//# sourceMappingURL=marzban.serice.d.ts.map