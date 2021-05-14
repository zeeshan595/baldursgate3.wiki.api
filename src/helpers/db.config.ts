import { ConnectionOptions } from 'typeorm';
import { entities } from '../models';
import { env } from './environment';

export default {
  type: 'postgres',
  url: env.DATABASE_URL,
  entities: entities,
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
  dropSchema: false,
  synchronize: false,
} as ConnectionOptions;
