"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefaultAdmin = void 0;
const config_1 = require("../config");
const isDefaultAdmin = (telegramId) => config_1.OWNER_IDS.includes(telegramId);
exports.isDefaultAdmin = isDefaultAdmin;
//# sourceMappingURL=is-default-admin.utils.js.map