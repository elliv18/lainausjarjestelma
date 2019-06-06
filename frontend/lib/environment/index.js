export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const IS_BROWSER = typeof window !== 'undefined';
export const IS_SERVER = !IS_BROWSER;
export const JWT = IS_BROWSER && localStorage.getItem('jwtToken');
