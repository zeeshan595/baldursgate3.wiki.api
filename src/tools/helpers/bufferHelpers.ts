export const bufferToArrayBuffer = (buffer: Buffer): ArrayBuffer => {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
};

export const arrayBufferToBuffer = (arrayBuffer: ArrayBuffer): Buffer => {
  var buf = Buffer.alloc(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
};

export const arrayBufferToString = (
  arrayBuffer: Uint8Array | Uint16Array,
): string => {
  return String.fromCharCode(...arrayBuffer).normalize();
};

export const arrayBufferToNumbers = (
  arrayBuffer:
    | Uint8Array
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | BigUint64Array
    | BigInt64Array,
): number[] => {
  const data: number[] = [];
  for (let i = 0; i < arrayBuffer.length; i++) {
    data.push(Number(arrayBuffer[i]));
  }
  return data;
};
