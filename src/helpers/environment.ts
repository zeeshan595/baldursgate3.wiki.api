import { config } from 'dotenv';
config();

export type Environment = {
  REDIS_URL: string;
  DATABASE_URL: string;
};

export const env = Object.assign({}, process.env) as Environment;
