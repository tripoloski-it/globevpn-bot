export interface IAuthorizeResponse {
	readonly access_token: string;
	readonly token_type: string;
}

/* Required data:
	> username: 		must have 3 to 32 characters and is allowed to contain a-z, 0-9, and underscores in between
	> expire: 			must be an UTC timestamp
	> data_limit: 	must be in Bytes, e.g. 1073741824B = 1GB
	> proxies: 			dictionary of protocol:settings
	> inbounds:			dictionary of protocol:inbound_tags, empty means all inbounds
*/
export interface ICreateUserRequest {
	readonly username: string;
	readonly expire: number;
	readonly data_limit: number;
	readonly proxies: Record<string, any>;
	readonly inbounds: Record<string, string[]>;
	readonly note: string;
	readonly data_limit_reset_strategy?: DataLimitResetStrategy;
	readonly status: UserStatus;
	readonly on_hold_timeout?: Date;
	readonly on_hold_expire_duration?: number;
}

export interface ICreateUserResponse extends ICreateUserRequest {
	readonly sub_updated_at: Date | null;
	readonly sub_last_user_agent: string | null;
	readonly online_at: Date | null;
	readonly used_traffic: number;
	readonly created_at: Date;
	readonly links: string[];
	readonly subscription_url: string;
	readonly excluded_inbounds: Record<string, string[]>;
}

type DataLimitResetStrategy = 'no_reset' | 'day' | 'month' | 'year';
type UserStatus = 'active' | 'disabled' | 'limited' | 'expired' | 'on_hold';
