"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToArrayBuffer = convertToArrayBuffer;
function convertToArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i++) {
        uint8Array[i] = buffer[i];
    }
    return arrayBuffer;
}
//# sourceMappingURL=convert-to-arraybuffer.utils.js.map