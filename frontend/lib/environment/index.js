import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { BACKEND_HOST, BACKEND_PORT } = publicRuntimeConfig;

export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const IS_BROWSER = typeof window !== 'undefined';
export const IS_SERVER = !IS_BROWSER;
export const JWT = IS_BROWSER && localStorage.getItem('jwtToken');

//export const BACKEND_HOST = process.env.BACKEND_HOST || 'http://localhost';
//export const BACKEND_PORT = process.env.BACKEND_PORT || 3050;

console.log(`
NODE_ENV: ${NODE_ENV}
BACKEND_HOST: ${BACKEND_HOST}
BACKEND_PORT: ${BACKEND_PORT}
`);
