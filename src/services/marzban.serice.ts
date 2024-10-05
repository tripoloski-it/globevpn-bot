import axios, { AxiosInstance } from 'axios';
import { MARZBAN_BASE_URL, MARZBAN_PASSWORD, MARZBAN_USERNAME } from '../config';
import { AxiosError } from 'axios';
import { IAuthorizeResponse, ICreateUserRequest, ICreateUserResponse } from '../types';
import axiosRetry from 'axios-retry';
import { generate as getRandomString } from 'randomstring';
import { getRandomInt } from '../utils';

class Marzban {
	private token?: string;
	private client: AxiosInstance = axios.create({ baseURL: MARZBAN_BASE_URL });
	private tokenHeader = 'Authorization';

	constructor(private username: string, private password: string) {
		this.init();
	}

	public async authorize() {
		const response = await this.client.post<IAuthorizeResponse>('admin/token', this.getAuthData());

		this.token = response.data.access_token;

		return response.data;
	}

	public async currentAdmin() {
		const response = await this.client.get('admin');
		return response.data;
	}

	public async createUser(
		userId: number,
		telegramId: string,
		username: string | null,
		durationInDays: number,
	) {
		const response = await this.client.post<ICreateUserResponse>(
			'user',
			this.createUserData(userId, telegramId, username, durationInDays),
		);
		return response.data;
	}

	public async removeUser(username: string) {
		const response = await this.client.delete(`user/${username}`, {
			validateStatus: status => status === 404 || status === 200,
		});
		return response.status === 200;
	}

	private createUserData(
		userId: number,
		telegramId: string,
		username: string | null,
		durationInDays: number,
	) {
		const user: ICreateUserRequest = {
			data_limit: 0,
			expire: this.getExpireDuration(durationInDays),
			status: 'active',
			proxies: {
				vless: {
					flow: 'xtls-rprx-vision',
				},
			},
			inbounds: {
				vless: ['VLESS TCP REALITY'],
			},
			username: this.generateUsername(),
			note: `Proxy for user#${userId} (Telegram: ${username ?? telegramId})`,
		};
		return user;
	}

	private generateUsername() {
		return getRandomString({
			capitalization: 'lowercase',
			length: getRandomInt(8, 32),
			charset: 'alphanumeric',
		});
	}

	private getExpireDuration(durationDays: number) {
		return (Date.now() + 1000 * 60 * 60 * 24 * durationDays) / 1000;
	}

	private getAuthData() {
		const formData = new FormData();
		formData.append('username', this.username);
		formData.append('password', this.password);
		return formData;
	}

	private init() {
		this.client.interceptors.request.use(async config => {
			if (!config.headers[this.tokenHeader] && this.token) {
				config.headers[this.tokenHeader] = `Bearer ${this.token}`;
			}
			return config;
		});

		axiosRetry(this.client, {
			retries: 3,
			retryDelay: retryDelay => retryDelay * 500,
			retryCondition: error => axiosRetry.isNetworkError(error) || error.response?.status === 401,
			onRetry: async (retryCount, error, request) => {
				await this.authorize();
				if (request.headers) request.headers[this.tokenHeader] = `Bearer ${this.token}`;
				console.warn(
					`Authorization. Retry request (${retryCount}). Status: ${
						error.response?.status
					}. Has token: ${!!request.headers?.['Authorization']}`,
				);
			},
		});
	}
}

export const marzban = new Marzban(MARZBAN_USERNAME, MARZBAN_PASSWORD);
