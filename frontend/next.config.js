require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  env: {
    BACKEND_HOST: process.env.BACKEND_HOST,
    BACKEND_PORT: process.env.BACKEND_PORT,
  },
  webpack: config => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, './.env'),
        systemvars: true,
        silent: true,
      }),
    ];

    return config;
  },
};
