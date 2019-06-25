import { config } from 'dotenv';

config();

export const secret = process.env.JWT_SECRET || '1234';
