exports.DEVELOPMENT = 'development';
exports.PRODUCTION = 'production';

exports.BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
exports.BACKEND_PORT = process.env.BACKEND_PORT || 3000;

exports.NODE_ENV = process.env.NODE_ENV || 'development';

exports.JWT_SECRET = process.env.JWT_SECRET || 'gg';

exports.ROOT_ADMIN_USERNAME = process.env.ROOT_ADMIN_USERNAME || 'admin';
exports.ROOT_ADMIN_PASS = process.env.ROOT_ADMIN_PASS || 'test';

exports.DB_RESET = process.env.DB_RESET === 'true' ? true : false;
