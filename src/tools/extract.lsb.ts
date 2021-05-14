import * as fs from 'fs';
import {
  bufferToArrayBuffer,
  arrayBufferToString,
  arrayBufferToNumbers,
} from './helpers/bufferHelpers';

export const SIGNATURE = 'LSFM';

export enum AttributeDataType {
  None = 0,
  Byte = 1,
  Short = 2,
  UShort = 3,
  Int = 4,
  UInt = 5,
  Float = 6,
  Double = 7,
  IVec2 = 8,
  IVec3 = 9,
  IVec4 = 10,
  Vec2 = 11,
  Vec3 = 12,
  Vec4 = 13,
  Mat2 = 14,
  Mat3 = 15,
  Mat3x4 = 16,
  Mat4x3 = 17,
  Mat4 = 18,
  Bool = 19,
  String = 20,
  Path = 21,
  FixedString = 22,
  LSString = 23,
  ULongLong = 24,
  ScratchBuffer = 25,
  Long = 26,
  Int8 = 27,
  TranslatedString = 28,
  WString = 29,
  LSWString = 30,
  GUID = 31,
  Int64 = 32,
  TranslatedFSString = 33,
  // Last supported datatype, always keep this one at the end
  Max = TranslatedFSString,
}

export type LsbVersion = {
  timestamp: number;
  major: number;
  minor: number;
  revision: number;
  build: number;
};

export type LsbMetadata = {
  signature: string;
  totalSize: number;
  bigEndian: number;
  unknown: number;
  metadata: LsbVersion;
};

export type StaticStrings = {
  byteLength: number;
  strings: {
    [key: number]: string;
  };
};

export type Attribute = {
  type: AttributeDataType;
  value: any;
};

export type Node = {
  name: string;
  attributes: {
    [key: string]: Attribute;
  };
  children: Node[];
};

export const getMetadata = (buffer: ArrayBuffer): LsbMetadata => {
  const signature = arrayBufferToString(new Uint8Array(buffer.slice(0, 4)));
  if (signature !== SIGNATURE) {
    throw new Error('invalid file signature');
  }
  const intArr = new Uint32Array(buffer.slice(4, 16));
  const timestamp = new BigUint64Array(buffer.slice(16, 24));
  const versionArr = new Uint32Array(buffer.slice(24, 40));
  if (intArr[0] !== buffer.byteLength) {
    throw new Error('buffer size does not match expected content size');
  }
  if (intArr[1] !== 0) {
    throw new Error('big-endian LSB files are not supported');
  }
  return {
    signature,
    totalSize: intArr[0],
    bigEndian: intArr[1],
    unknown: intArr[3],
    metadata: {
      timestamp: Number(timestamp),
      major: versionArr[0],
      minor: versionArr[1],
      revision: versionArr[2],
      build: versionArr[3],
    },
  };
};

export const getStaticStrings = (buffer: ArrayBuffer): StaticStrings => {
  let staticStrings: StaticStrings = {
    byteLength: 0,
    strings: {},
  };
  const stringsLen = new Uint32Array(buffer.slice(40, 44))[0];
  let offset = 44;
  for (let i = 0; i < stringsLen; i++) {
    const stringLen = new Int32Array(buffer.slice(offset, offset + 4))[0];
    offset += 4;
    const str = new Int8Array(buffer.slice(offset, offset + stringLen));
    offset += stringLen;
    const index = new Uint32Array(buffer.slice(offset, offset + 4))[0];
    offset += 4;
    if (staticStrings.strings[index]) {
      throw new Error('static strings - duplicate key');
    }
    staticStrings.strings[index] = arrayBufferToString(new Uint8Array(str));
  }

  staticStrings.byteLength = offset;
  return staticStrings;
};

export const getDataColumns = (type: AttributeDataType) => {
  switch (type) {
    case AttributeDataType.IVec2:
    case AttributeDataType.Vec2:
    case AttributeDataType.Mat2:
      return 2;
    case AttributeDataType.IVec3:
    case AttributeDataType.Vec3:
    case AttributeDataType.Mat3:
    case AttributeDataType.Mat4x3:
      return 3;
    case AttributeDataType.IVec4:
    case AttributeDataType.Vec4:
    case AttributeDataType.Mat4:
    case AttributeDataType.Mat3x4:
      return 4;
  }
  throw new Error('invalid data type');
};

export const getDataRows = (type: AttributeDataType) => {
  switch (type) {
    case AttributeDataType.IVec2:
    case AttributeDataType.Vec2:
    case AttributeDataType.IVec3:
    case AttributeDataType.Vec3:
    case AttributeDataType.IVec4:
    case AttributeDataType.Vec4:
      return 1;
    case AttributeDataType.Mat2:
      return 2;
    case AttributeDataType.Mat3:
    case AttributeDataType.Mat3x4:
      return 3;
    case AttributeDataType.Mat4:
    case AttributeDataType.Mat4x3:
      return 4;
  }
  throw new Error('invalid data type');
};

export const getAttributeVectors = (
  buffer: ArrayBuffer,
  type: AttributeDataType,
  offset: number,
  useInt: boolean,
): {
  byteLength: number;
  data: number[] | number[][];
} => {
  const columns = getDataColumns(type);
  const rows = getDataRows(type);
  const dataRows = rows * 4;
  const startingOffset = offset;

  const rtn = [];
  for (let i = 0; i < columns; i++) {
    let data;
    if (useInt) {
      data = new Int32Array(buffer.slice(offset, offset + dataRows));
      offset += dataRows;
    } else {
      data = new Float32Array(buffer.slice(offset, offset + dataRows));
      offset += dataRows;
    }
    if (rows === 1) {
      rtn.push(data[0]);
    } else {
      const rtnRows = [];
      for (let j = 0; j < rows; j++) {
        rtnRows.push(data[j]);
      }
      rtn.push(rtnRows);
    }
  }

  return {
    byteLength: offset - startingOffset,
    data: rtn,
  };
};

export const getAttributeString = (
  buffer: ArrayBuffer,
  type: AttributeDataType,
  offset: number,
): {
  byteLength: number;
  data: string;
} => {
  const startingOffset = offset;

  let attributeValueLength =
    new Int32Array(buffer.slice(offset, offset + 4))[0] - 1;
  offset += 4;

  if (
    type === AttributeDataType.WString ||
    type === AttributeDataType.LSWString
  ) {
    attributeValueLength *= 2;
  }

  const attributeValue = new Uint8Array(
    buffer.slice(offset, offset + attributeValueLength),
  );
  offset += attributeValueLength;

  // string contains bogus characters
  // cleanup string
  let hasBadBytes = false;
  while (
    attributeValueLength > 0 &&
    attributeValue[attributeValueLength - 1] === 0
  ) {
    attributeValueLength--;
    hasBadBytes = true;
  }
  const strValue = arrayBufferToString(
    attributeValue.slice(0, attributeValueLength),
  );

  let nextByte: number = 0;
  if (
    type === AttributeDataType.WString ||
    type === AttributeDataType.LSWString
  ) {
    nextByte = new Uint16Array(buffer.slice(offset, offset + 2))[0];
    offset += 2;
  } else {
    nextByte = new Uint8Array(buffer.slice(offset, offset + 1))[0];
    offset += 1;
  }
  if (nextByte !== 0 && !hasBadBytes) {
    throw new Error('invalid string termination');
  }

  return {
    byteLength: offset - startingOffset,
    data: strValue,
  };
};

export const getAttributeTranslation = (
  buffer: ArrayBuffer,
  type: AttributeDataType,
  offset: number,
): {
  byteLength: number;
  data: string;
  handle: string;
} => {
  const startingOffset = offset;
  let strVal: string;
  let strHandle: string;

  const strVersion = new Uint16Array(buffer.slice(offset, offset + 2))[0];
  const strTest = new Uint16Array(buffer.slice(offset + 2, offset + 4))[0];
  if (strTest === 0) {
    const valueData = getAttributeString(buffer, type, offset);
    offset += valueData.byteLength;
    strVal = valueData.data;
  } else {
    offset += 2;
  }

  const handleData = getAttributeString(buffer, type, offset);
  offset += handleData.byteLength;
  strHandle = handleData.data;

  return {
    byteLength: offset - startingOffset,
    data: strVal,
    handle: strHandle,
  };
};

export const getAttribute = (
  buffer: ArrayBuffer,
  staticStrings: StaticStrings,
  offset: number,
): {
  name: string;
  value: Attribute;
  byteLength: number;
} => {
  const startingOffset = offset;
  const attrArr = new Uint32Array(buffer.slice(offset, offset + 8));
  offset += 8;

  //attribute info
  const attrNameId = attrArr[0];
  const attrTypeId = attrArr[1];

  if (attrTypeId > AttributeDataType.Max) {
    throw new Error(`unknown data type: ${attrTypeId}`);
  }
  let attrVal: any;

  switch (attrTypeId) {
    case AttributeDataType.None:
      attrVal = null;
      break;
    case AttributeDataType.Bool:
      attrVal = new Uint8Array(buffer.slice(offset, offset + 1))[0] !== 0;
      offset += 1;
      break;
    case AttributeDataType.ULongLong:
      attrVal = Number(new BigUint64Array(buffer.slice(offset, offset + 8))[0]);
      offset += 8;
      break;
    case AttributeDataType.Int64:
      attrVal = Number(new BigInt64Array(buffer.slice(offset, offset + 8))[0]);
      offset += 8;
      break;
    case AttributeDataType.Int8:
      attrVal = new Int8Array(buffer.slice(offset, offset + 1))[0];
      offset += 1;
      break;
    case AttributeDataType.GUID:
      attrVal = arrayBufferToString(
        new Uint8Array(buffer.slice(offset, offset + 16)),
      );
      offset += 16;
      break;
    case AttributeDataType.Byte:
      attrVal = new Uint8Array(buffer.slice(offset, offset + 1))[0];
      offset += 1;
      break;
    case AttributeDataType.Short:
      attrVal = new Int16Array(buffer.slice(offset, offset + 2))[0];
      offset += 2;
      break;
    case AttributeDataType.UShort:
      attrVal = new Uint16Array(buffer.slice(offset, offset + 2))[0];
      offset += 2;
      break;
    case AttributeDataType.Int:
      attrVal = new Int32Array(buffer.slice(offset, offset + 4))[0];
      offset += 4;
      break;
    case AttributeDataType.UInt:
      attrVal = new Uint32Array(buffer.slice(offset, offset + 4))[0];
      offset += 4;
      break;
    case AttributeDataType.Float:
      attrVal = new Float32Array(buffer.slice(offset, offset + 4))[0];
      offset += 4;
      break;
    case AttributeDataType.Double:
      attrVal = new Float64Array(buffer.slice(offset, offset + 8))[0];
      offset += 8;
      break;
    case AttributeDataType.IVec2:
    case AttributeDataType.IVec3:
    case AttributeDataType.IVec4:
      {
        const vec = getAttributeVectors(buffer, attrTypeId, offset, true);
        attrVal = vec.data;
        offset += vec.byteLength;
      }
      break;
    case AttributeDataType.Vec3:
    case AttributeDataType.Vec4:
    case AttributeDataType.Vec2:
    case AttributeDataType.Mat2:
    case AttributeDataType.Mat3:
    case AttributeDataType.Mat4:
    case AttributeDataType.Mat3x4:
    case AttributeDataType.Mat4x3:
      {
        const vec = getAttributeVectors(buffer, attrTypeId, offset, false);
        attrVal = vec.data;
        offset += vec.byteLength;
      }
      break;
    case AttributeDataType.String:
    case AttributeDataType.Path:
    case AttributeDataType.FixedString:
    case AttributeDataType.LSString:
    case AttributeDataType.WString:
    case AttributeDataType.LSWString:
      {
        const str = getAttributeString(buffer, attrTypeId, offset);
        offset += str.byteLength;
        attrVal = str.data;
      }
      break;
    case AttributeDataType.TranslatedString:
      {
        const str = getAttributeTranslation(buffer, attrTypeId, offset);
        offset += str.byteLength;
        if (str.data) {
          attrVal = {
            value: str.data,
            handle: str.handle,
          };
        } else {
          attrVal = str.handle;
        }
      }
      break;
    case AttributeDataType.ScratchBuffer:
      {
        const len = new Int32Array(buffer.slice(offset, offset + 4))[0];
        offset += 4;
        const val = new Uint8Array(buffer.slice(offset, offset + len));
        offset += len;
        attrVal = arrayBufferToNumbers(val);
      }
      break;
    default:
      throw new Error(`unknown data type: ${attrTypeId}`);
  }
  return {
    name: staticStrings.strings[attrNameId],
    value: attrVal,
    byteLength: offset - startingOffset,
  };
};

export const getNode = (
  buffer: ArrayBuffer,
  staticString: StaticStrings,
  offset: number,
): {
  bytesLength: number;
  node: Node;
} => {
  const startingOffset = offset;
  let node: Node = {
    name: '',
    attributes: {},
    children: [],
  };
  const infoArr = new Uint32Array(buffer.slice(offset, offset + 12));
  offset += 12;

  const nodeNameId = infoArr[0];
  const attributeCount = infoArr[1];
  const childCount = infoArr[2];
  node.name = staticString.strings[nodeNameId];
  for (let i = 0; i < attributeCount; i++) {
    const attrib = getAttribute(buffer, staticString, offset);
    node.attributes[attrib.name] = attrib.value;
    offset += attrib.byteLength;
  }

  for (let i = 0; i < childCount; i++) {
    const childNode = getNode(buffer, staticString, offset);
    node.children.push(childNode.node);
  }

  return {
    bytesLength: offset - startingOffset,
    node,
  };
};

export const getRootNode = (
  buffer: ArrayBuffer,
  staticString: StaticStrings,
): Node[] => {
  const rootNodes: Node[] = [];
  let offset = staticString.byteLength;
  const regionsLen = new Uint32Array(buffer.slice(offset, offset + 4))[0];
  offset += 4;
  for (let i = 0; i < regionsLen; i++) {
    let rootNode: Node = {
      name: '',
      attributes: {},
      children: [],
    };
    const regionNameId = new Uint32Array(buffer.slice(offset, offset + 4))[0];
    offset += 4;
    const regionOffset = new Uint32Array(buffer.slice(offset, offset + 4))[0];
    offset += 4;

    // update root node name
    rootNode.name = staticString.strings[regionNameId];

    // add children to rootNode
    const lastRegionPosition = offset;
    offset = regionOffset;
    const node = getNode(buffer, staticString, offset);
    rootNode.children.push(node.node);

    offset = lastRegionPosition;
    rootNodes.push(rootNode);
  }

  return rootNodes;
};

export const uncompressLsb = (inputFile: string, outputFile: string) => {
  const buffer = bufferToArrayBuffer(fs.readFileSync(inputFile));
  const staticStrings = getStaticStrings(buffer);
  const rootNode = getRootNode(buffer, staticStrings);
  fs.writeFileSync(outputFile, JSON.stringify(rootNode));
};
