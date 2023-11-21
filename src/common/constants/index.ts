import { config } from 'dotenv';
config({ path: process.cwd() + '/.env' });

export const JWT_SECRET = process.env.JWT_SECRET;
