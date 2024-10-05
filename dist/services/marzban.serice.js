"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marzban = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const axios_retry_1 = __importDefault(require("axios-retry"));
const randomstring_1 = require("randomstring");
const utils_1 = require("../utils");
class Marzban {
    username;
    password;
    token;
    client = axios_1.default.create({ baseURL: config_1.MARZBAN_BASE_URL });
    tokenHeader = 'Authorization';
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.init();
    }
    async authorize() {
        const response = await this.client.post('admin/token', this.getAuthData());
        this.token = response.data.access_token;
        return response.data;
    }
    async currentAdmin() {
        const response = await this.client.get('admin');
        return response.data;
    }
    async createUser(userId, telegramId, username, durationInDays) {
        const response = await this.client.post('user', this.createUserData(userId, telegramId, username, durationInDays));
        return response.data;
    }
    async removeUser(username) {
        const response = await this.client.delete(`user/${username}`, {
            validateStatus: status => status === 404 || status === 200,
        });
        return response.status === 200;
    }
    createUserData(userId, telegramId, username, durationInDays) {
        const user = {
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
    generateUsername() {
        return (0, randomstring_1.generate)({
            capitalization: 'lowercase',
            length: (0, utils_1.getRandomInt)(8, 32),
            charset: 'alphanumeric',
        });
    }
    getExpireDuration(durationDays) {
        return (Date.now() + 1000 * 60 * 60 * 24 * durationDays) / 1000;
    }
    getAuthData() {
        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);
        return formData;
    }
    init() {
        this.client.interceptors.request.use(async (config) => {
            if (!config.headers[this.tokenHeader] && this.token) {
                config.headers[this.tokenHeader] = `Bearer ${this.token}`;
            }
            return config;
        });
        (0, axios_retry_1.default)(this.client, {
            retries: 3,
            retryDelay: retryDelay => retryDelay * 500,
            retryCondition: error => axios_retry_1.default.isNetworkError(error) || error.response?.status === 401,
            onRetry: async (retryCount, error, request) => {
                await this.authorize();
                if (request.headers)
                    request.headers[this.tokenHeader] = `Bearer ${this.token}`;
                console.warn(`Authorization. Retry request (${retryCount}). Status: ${error.response?.status}. Has token: ${!!request.headers?.['Authorization']}`);
            },
        });
    }
}
exports.marzban = new Marzban(config_1.MARZBAN_USERNAME, config_1.MARZBAN_PASSWORD);
//# sourceMappingURL=marzban.serice.js.map