import xml2js from 'xml2js';
import * as fs from 'fs';

export const uncompressLocalization = async (
  inputFile: string,
  outputFile: string,
) => {
  const content = fs.readFileSync(inputFile);
  const data = await xml2js.parseStringPromise(content);
  let loc: {
    [key: string]: string;
  } = {};
  for (const item of data.contentList.content) {
    loc[item.$.contentuid] = item._;
  }
  fs.writeFileSync(outputFile, JSON.stringify(loc));
};
