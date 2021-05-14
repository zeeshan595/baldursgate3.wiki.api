export type PlainObject = {
  name: string;
  type: string;
  using: string;
  data:
    | string
    | {
        [key: string]: string;
      };
};

export const parseText = (text: string): PlainObject[] => {
  const objArr: PlainObject[] = [];
  const blobs = text.split('\n\n');
  for (const blob of blobs) {
    let obj: PlainObject = {
      name: null,
      type: null,
      using: null,
      data: null,
    };
    for (const line of blob.split('\n')) {
      if (line.startsWith('new entry')) {
        obj.name = line.split('"')[1];
      } else if (line.startsWith('type')) {
        obj.type = line.split('"')[1];
      } else if (line.startsWith('using')) {
        obj.using = line.split('"')[1];
      } else if (line.startsWith('data')) {
        const splitData = line.split('"');
        const key = splitData[1];
        const value = splitData[3];
        obj.data[key] = value;
      } else if (line.startsWith('key')) {
        const splitData = line.split('"');
        const key = splitData[1];
        const value = splitData[3];
        obj.name = key;
        obj.type = 'key';
        obj.data = value;
      }
    }
    objArr.push(obj);
  }
  return objArr;
};
