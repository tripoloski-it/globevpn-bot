"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const config_1 = require("../config");
class Users {
    users;
    constructor(users) {
        this.users = users;
    }
    async findOrCreate(telegramId, email, username, isDefaultAdmin = false) {
        const user = await this.users.findUnique({
            where: { telegramId },
        });
        if (user !== null)
            return user;
        const newUser = await this.users.create({
            data: {
                email,
                telegramId,
                isAdmin: isDefaultAdmin,
                username,
            },
        });
        console.log(`New user created. ID: ${newUser.id} (Is default admin: ${isDefaultAdmin})`);
        return newUser;
    }
    async findByTelegramId(telegramId) {
        const user = await this.users.findUnique({
            where: { telegramId },
        });
        return user;
    }
    async updateById(id, data) {
        const user = await this.users.update({ where: { id }, data });
        return user;
    }
}
exports.users = new Users(config_1.prisma.users);
//# sourceMappingURL=users.service.js.map