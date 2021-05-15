import * as fs from 'fs';
import rimraf from 'rimraf';
import { uncompressPak } from './extract.pak';
import { uncompressLsb } from './extract.lsb';
import { uncompressLsx } from './extract.lsx';
import { uncompressTxt } from './extract.txt';
import { uncompressLocalization } from './extract.loc';

const recursiveExtract = async (
  inPath: string,
  outPath: string,
  ext: 'lsb' | 'lsx' | 'txt',
) => {
  if (fs.existsSync(outPath) === false) {
    fs.mkdirSync(outPath, { recursive: true });
  }
  const localizationFiles = fs.readdirSync(inPath);
  for (const locFiles of localizationFiles) {
    if (fs.lstatSync(`${inPath}/${locFiles}`).isDirectory()) {
      recursiveExtract(`${inPath}/${locFiles}`, `${outPath}/${locFiles}`, ext);
      continue;
    }
    const fileName = locFiles.split('.')[0];
    const filePath = `${inPath}/${fileName}`;
    if (fs.existsSync(`${filePath}.${ext}`) === false) {
      continue;
    }
    console.log(`extracting: ${filePath}.${ext}`);
    if (ext === 'lsb') {
      uncompressLsb(`${filePath}.lsb`, `${outPath}/${fileName}.json`);
    } else if (ext === 'lsx') {
      await uncompressLsx(`${filePath}.lsx`, `${outPath}/${fileName}.json`);
    } else if (ext === 'txt') {
      uncompressTxt(`${filePath}.txt`, `${outPath}/${fileName}.json`);
    } else {
      throw new Error(`unknown format ${ext}`);
    }
  }
};

const main = async () => {
  // extract packages
  const packages = fs.readdirSync('assets/pak');
  for (const pak of packages) {
    const extractPath = `assets/pak/${pak.split('.')[0]}`;
    if (fs.existsSync(extractPath) === false) {
      console.log(`extracting: ${pak}`);
      uncompressPak(`assets/pak/${pak}`, extractPath);
    }
  }

  // extract localization files
  console.log('extracting: english localization file');
  await uncompressLocalization(
    'assets/pak/English/Localization/English/english.xml',
    'assets/localization.json',
  );

  // extract required shared files
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Localization',
    'assets/localization',
    'lsb',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Lists',
    'assets/lists',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Tags',
    'assets/tags',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Tags',
    'assets/tags',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Races',
    'assets/races',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Gods',
    'assets/gods',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Feats',
    'assets/feats',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/EquipmentTypes',
    'assets/equipmentTypes',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/ClassDescriptions',
    'assets/class',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Backgrounds',
    'assets/backgrounds',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/ActionResourceDefinitions',
    'assets/resources',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/ActionResourceGroupDefinitions',
    'assets/resources',
    'lsx',
  );
  await recursiveExtract(
    'assets/pak/Shared/Public/Shared/Stats/Generated/Data',
    'assets/generated',
    'txt',
  );

  // clean up
  console.log('cleaning up...');
  for (const pak of packages) {
    const extractPath = `assets/pak/${pak.split('.')[0]}`;
    if (fs.existsSync(extractPath)) {
      rimraf.sync(extractPath);
    }
  }
};
main();
