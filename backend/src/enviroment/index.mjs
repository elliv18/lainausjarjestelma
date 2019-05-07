export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
export const BACKEND_PORT = process.env.BACKEND_PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const JWT_SECRET = process.env.JWT_SECRET || 'gg';

export const ROOT_ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL || 'admin@admin.com';
export const ROOT_ADMIN_PASS = process.env.ROOT_ADMIN_PASS || 'test';

export const DB_RESET = process.env.DB_RESET === 'true'
                                                ? true
                                                : false;
