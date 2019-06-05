//import * as dotenv from 'dotenv';
//dotenv.config();

export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const IS_BROWSER = typeof window !== 'undefined';
export const IS_SERVER = !IS_BROWSER;
export const JWT = IS_BROWSER && localStorage.getItem('jwtToken');

export const FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost';
export const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

console.log(`
NODE_ENV: ${NODE_ENV}
FRONTEND_HOST: ${FRONTEND_HOST}
FRONTEND_PORT: ${FRONTEND_PORT}
`);
