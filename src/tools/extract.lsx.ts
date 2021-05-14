import { Node, AttributeDataType, Attribute, getNode } from './extract.lsb';
import * as xml2js from 'xml2js';
import * as fs from 'fs';

export const getAttributeType = (attrib): AttributeDataType => {
  switch (attrib.$.type) {
    case 'FixedString':
    case 'LSString':
      return AttributeDataType.LSString;
    case 'TranslatedString':
      return AttributeDataType.TranslatedString;
    case 'guid':
      return AttributeDataType.GUID;
    case 'bool':
      return AttributeDataType.Bool;
    case 'uint8':
    case 'uint16':
    case 'uint32':
      return AttributeDataType.UInt;
    case 'int8':
    case 'int16':
    case 'int32':
      return AttributeDataType.Int;
    case 'fvec2':
    case 'ivec2':
      return AttributeDataType.Vec2;
    case 'fvec3':
    case 'ivec3':
      return AttributeDataType.Vec3;
    case 'fvec4':
    case 'ivec4':
      return AttributeDataType.Vec4;
    case 'mat4x4':
      return AttributeDataType.Mat4;
  }
  throw new Error(`invalid attribute type: ${attrib.$.type}`);
};

export const getVector = (vec, len: number) => {
  if (len === 2) {
    return [Number.parseFloat(vec.x), Number.parseFloat(vec.y)];
  } else if (len === 3) {
    return [
      Number.parseFloat(vec.x),
      Number.parseFloat(vec.y),
      Number.parseFloat(vec.z),
    ];
  } else if (len === 4) {
    return [
      Number.parseFloat(vec.x),
      Number.parseFloat(vec.y),
      Number.parseFloat(vec.z),
      Number.parseFloat(vec.w),
    ];
  }
};

export const getAttribute = (attrib): Attribute => {
  const type = getAttributeType(attrib);
  let value: any;

  switch (type) {
    case AttributeDataType.Bool:
      value = attrib.$.value === 'true';
      break;
    case AttributeDataType.UInt:
    case AttributeDataType.Int:
    case AttributeDataType.Int8:
    case AttributeDataType.Int64:
    case AttributeDataType.UShort:
    case AttributeDataType.Short:
    case AttributeDataType.ULongLong:
    case AttributeDataType.Long:
    case AttributeDataType.Float:
    case AttributeDataType.Double:
      value = Number.parseFloat(attrib.$.value);
      break;
    case AttributeDataType.GUID:
    case AttributeDataType.LSString:
    case AttributeDataType.String:
    case AttributeDataType.FixedString:
    case AttributeDataType.WString:
    case AttributeDataType.LSWString:
      value = attrib.$.value;
      break;
    case AttributeDataType.TranslatedString:
      value = attrib.$.handle;
      break;
    case AttributeDataType.Vec2:
      value = getVector(attrib.float2.$, 2);
      break;
    case AttributeDataType.Vec3:
      value = getVector(attrib.float3.$, 3);
      break;
    case AttributeDataType.Vec4:
      value = getVector(attrib.float4.$, 4);
      break;
    case AttributeDataType.Mat4:
      value = [
        getVector(attrib.mat4.float4.$, 4),
        getVector(attrib.mat4.float4.$, 4),
        getVector(attrib.mat4.float4.$, 4),
        getVector(attrib.mat4.float4.$, 4),
      ];
      break;
    default:
      value = null;
      break;
  }

  return {
    type,
    value,
  };
};

export const getNodes = (data: any): Node | Node[] => {
  let rtn: Node = {
    name: '',
    attributes: {},
    children: [],
  };

  // array check
  const isArray = Array.isArray(data);
  if (isArray) {
    if (data.length === 1) {
      data = data[0];
    } else {
      return data.map((d) => getNodes(d));
    }
  }

  const keys = Object.keys(data);

  // figure out if this node is useful
  if (data.$ && data.$) {
    rtn.name = data.$.id;
  } else {
    if (keys.length === 1) {
      return getNodes(data[keys[0]]);
    } else {
      throw new Error('something is wrong');
    }
  }

  // setup attributes
  if (data.attribute) {
    for (const attrib of data.attribute) {
      rtn.attributes[attrib.$.id] = getAttribute(attrib);
    }
  }

  // setup children
  for (const key of keys) {
    if (key === '$' || key === 'attribute') {
      continue;
    }
    const childNodes = getNodes(data[key]);
    if (Array.isArray(childNodes)) {
      for (const childNode of childNodes) {
        rtn.children.push(childNode);
      }
    } else {
      rtn.children.push(childNodes);
    }
  }

  const shouldSkipNode =
    Object.keys(rtn.attributes).length === 0 && rtn.children.length === 1;
  if (shouldSkipNode) {
    return rtn.children[0];
  }

  return rtn;
};

export const uncompressLsx = async (inputFile: string, outputFile: string) => {
  const content = fs.readFileSync(inputFile, { encoding: 'utf8' });
  const data = await xml2js.parseStringPromise(content);
  const parsedData = getNodes(data.save.region);
  fs.writeFileSync(outputFile, JSON.stringify(parsedData));
};
