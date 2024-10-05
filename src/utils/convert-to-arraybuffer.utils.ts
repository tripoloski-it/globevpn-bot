export function convertToArrayBuffer(buffer: Buffer): ArrayBuffer {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const uint8Array = new Uint8Array(arrayBuffer);
	for (let i = 0; i < buffer.length; i++) {
		uint8Array[i] = buffer[i];
	}
	return arrayBuffer;
}
