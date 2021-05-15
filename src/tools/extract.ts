import * as fs from 'fs';
import { uncompressPak } from './extract.pak';
import { uncompressLsb } from './extract.lsb';
import { uncompressLsx } from './extract.lsx';
import { uncompressLocalization } from './extract.loc';

const recursiveLsb = (inPath: string, outPath: string) => {
  if (fs.existsSync(outPath) === false) {
    fs.mkdirSync(outPath, { recursive: true });
  }
  const localizationFiles = fs.readdirSync(inPath);
  for (const locFiles of localizationFiles) {
    if (fs.lstatSync(`${inPath}/${locFiles}`).isDirectory()) {
      recursiveLsb(`${inPath}/${locFiles}`, `${outPath}/${locFiles}`);
      continue;
    }
    const fileName = locFiles.split('.')[0];
    const filePath = `${inPath}/${fileName}`;
    uncompressLsb(`${filePath}.lsb`, `${outPath}/${fileName}.json`);
  }
};

const recursiveLsx = async (inPath: string, outPath: string) => {
  if (fs.existsSync(outPath) === false) {
    fs.mkdirSync(outPath, { recursive: true });
  }
  const localizationFiles = fs.readdirSync(inPath);
  for (const locFiles of localizationFiles) {
    if (fs.lstatSync(`${inPath}/${locFiles}`).isDirectory()) {
      recursiveLsx(`${inPath}/${locFiles}`, `${outPath}/${locFiles}`);
      continue;
    }
    const fileName = locFiles.split('.')[0];
    const filePath = `${inPath}/${fileName}`;
    await uncompressLsx(`${filePath}.lsx`, `${outPath}/${fileName}.json`);
  }
};

const main = async () => {
  uncompressLsb(
    'assets/pak/Shared/Public/Shared/Localization/ActionResourceDefinitions_Description.lsb',
    'test.json',
  );
  return;
  // extract packages
  const packages = fs.readdirSync('assets/pak');
  for (const pak of packages) {
    const extractPath = `assets/pak/${pak.split('.')[0]}`;
    if (fs.existsSync(extractPath) === false) {
      console.log(`extracting: assets/pak/${pak}`);
      uncompressPak(`assets/pak/${pak}`, extractPath);
    }
  }

  // extract localization files
  if (fs.existsSync('assets/localization') === false)
    fs.mkdirSync('assets/localization');
  const localizationFile =
    'assets/pak/English/Localization/English/english.xml';
  if (fs.existsSync(localizationFile) === false) {
    throw new Error('localization file not found');
  }
  await uncompressLocalization(
    localizationFile,
    'assets/localization/english.json',
  );

  // extract required shared files
  recursiveLsb(
    'assets/pak/Shared/Public/Shared/Localization',
    'assets/localization',
  );
  recursiveLsx('assets/pak/Shared/Public/Shared/Lists', 'assets/lists');
  recursiveLsx('assets/pak/Shared/Public/Shared/Tags', 'assets/tags');
  recursiveLsx('assets/pak/Shared/Public/Shared/Tags', 'assets/tags');
  recursiveLsx('assets/pak/Shared/Public/Shared/Races', 'assets/races');
  recursiveLsx('assets/pak/Shared/Public/Shared/Gods', 'assets/gods');
  recursiveLsx('assets/pak/Shared/Public/Shared/Feats', 'assets/feats');
  recursiveLsx(
    'assets/pak/Shared/Public/Shared/EquipmentTypes',
    'assets/equipmentTypes',
  );
  recursiveLsx(
    'assets/pak/Shared/Public/Shared/ClassDescriptions',
    'assets/class',
  );
  recursiveLsx(
    'assets/pak/Shared/Public/Shared/Backgrounds',
    'assets/backgrounds',
  );
  recursiveLsx(
    'assets/pak/Shared/Public/Shared/ActionResourceDefinitions',
    'assets/resources',
  );
  recursiveLsx(
    'assets/pak/Shared/Public/Shared/ActionResourceGroupDefinitions',
    'assets/resources',
  );
};
main();
