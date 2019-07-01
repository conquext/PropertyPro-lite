/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';

dotenv.config();

export const secret = process.env.JWT_SECRET || '1234';
