"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxLengths = void 0;
const getMaxLengths = (array) => {
    let maxLengths = {};
    for (let object of array) {
        for (const key in object) {
            const valueLength = String(object[key]).length;
            if (maxLengths[key] === undefined || valueLength > maxLengths[key]) {
                maxLengths[key] = valueLength + 1.5;
            }
        }
    }
    return maxLengths;
};
exports.getMaxLengths = getMaxLengths;
//# sourceMappingURL=get-max-lengths.utils.js.map