import { config } from 'dotenv';
config();

export type Environment = {};

export const env = Object.assign({}, process.env) as Environment;
