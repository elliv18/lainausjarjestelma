module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'test',
    database: process.env.DB_NAME || 'db',
    host: 'db',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: 'db',
    dialect: 'postgres',
  },
};
