import * as fs from 'fs';
import * as path from 'path';
import * as LZ4 from '@rinsuki/lz4-ts';
import {
  arrayBufferToBuffer,
  arrayBufferToNumbers,
  arrayBufferToString,
  bufferToArrayBuffer,
} from './helpers/bufferHelpers';

export const SIGNATURE = 'LSPK';

export type Metadata = {
  signature: string;
  version: number;
  fileListOffset: number;
  fileListSize: number;
  flags: number;
  priority: number;
  md5: number[];
  numParts: number;
};

export type FileEntry = {
  name: string;
  offsetInFile: number;
  sizeOnDisk: number;
  uncompressedSize: number;
  archivePart: number;
  flags: number;
  crc: number;
  unknown: number;
};

export const getMetadata = (buffer: ArrayBuffer): Metadata => {
  const signature = arrayBufferToString(new Uint8Array(buffer.slice(0, 4)));
  if (signature !== SIGNATURE) {
    throw new Error('invalid file signature');
  }

  const version = new Uint32Array(buffer.slice(4, 4))[0];
  const fileListOffset = Number(new BigUint64Array(buffer.slice(8, 16))[0]);
  const fileListSize = new Uint32Array(buffer.slice(16, 20))[0];
  const flags = new Uint8Array(buffer.slice(20, 21))[0];
  const priority = new Uint8Array(buffer.slice(21, 22))[0];
  const md5 = arrayBufferToNumbers(new Uint8Array(buffer.slice(22, 38)));
  const numParts = new Uint16Array(buffer.slice(38, 40))[0];

  return {
    signature,
    version,
    fileListOffset,
    fileListSize,
    flags,
    priority,
    md5,
    numParts,
  };
};

export const getFileList = (
  buffer: ArrayBuffer,
  metadata?: Metadata,
): FileEntry[] => {
  if (!metadata) {
    metadata = getMetadata(buffer);
  }
  const fileEntrySize = 256 + 8 * 3 + 4 * 4;
  const filesCount = new Int32Array(
    buffer.slice(metadata.fileListOffset, metadata.fileListOffset + 4),
  )[0];
  const compressedSize = new Int32Array(
    buffer.slice(metadata.fileListOffset + 4, metadata.fileListOffset + 8),
  )[0];

  // uncompress file list
  const compressedFileList = new Uint8Array(
    buffer.slice(
      metadata.fileListOffset + 8,
      metadata.fileListOffset + 8 + compressedSize,
    ),
  );
  const expectedUncompressedFileListSize = fileEntrySize * filesCount;
  const uncompressFileList = new Uint8Array(expectedUncompressedFileListSize);
  const uncompressFileListLength: number = LZ4.uncompressBlock(
    compressedFileList,
    uncompressFileList,
  );
  if (uncompressFileListLength !== expectedUncompressedFileListSize) {
    throw new Error('uncompressed file list does not match expected size');
  }
  const files: FileEntry[] = [];
  for (let i = 0; i < filesCount; i++) {
    const fileOffset = fileEntrySize * i;
    const fileBuffer = uncompressFileList.buffer.slice(
      fileOffset,
      fileOffset + fileEntrySize,
    );
    const fileName = arrayBufferToString(
      new Uint8Array(fileBuffer.slice(0, 256)),
    );
    const bigIntArr = new BigUint64Array(fileBuffer.slice(256, 280));
    const intArr = new Uint32Array(fileBuffer.slice(280, 296));
    files.push({
      name: fileName.replace(/\0/g, '').trim(),
      offsetInFile: Number(bigIntArr[0]),
      sizeOnDisk: Number(bigIntArr[1]),
      uncompressedSize: Number(bigIntArr[2]),
      archivePart: intArr[0],
      flags: intArr[1] & 0x0f,
      crc: intArr[2],
      unknown: intArr[3],
    });
  }
  return files;
};

export const getFileContents = (
  buffer: ArrayBuffer,
  file: FileEntry,
): Buffer => {
  const compressedFile = new Uint8Array(
    buffer.slice(file.offsetInFile, file.offsetInFile + file.sizeOnDisk),
  );
  const uncompressFile = new Uint8Array(file.uncompressedSize);
  const uncompressedSize = LZ4.uncompressBlock(compressedFile, uncompressFile);
  if (uncompressedSize !== file.uncompressedSize) {
    throw new Error('failed to uncompress file');
  }
  return arrayBufferToBuffer(uncompressFile);
};

export const uncompressFiles = (
  buffer: ArrayBuffer,
  files?: FileEntry[],
  prefix: string = 'data',
) => {
  if (!files) {
    files = getFileList(buffer);
  }
  for (const file of files) {
    const dir = path.dirname(file.name);
    if (fs.existsSync(`${prefix}/${dir}`) === false) {
      fs.mkdirSync(`${prefix}/${dir}`, { recursive: true });
    }
    const content = getFileContents(buffer, file);
    fs.writeFileSync(`${prefix}/${file.name}`, content);
  }
};

export const uncompressPak = (inputFile: string, outputPath: string) => {
  const buffer = bufferToArrayBuffer(fs.readFileSync(inputFile));
  const fileList = getFileList(buffer);
  uncompressFiles(buffer, fileList, outputPath);
};
