require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  env: {
    BACKEND_HOST: progress.env.BACKEND_HOST,
    BACKEND_PORT: progress.env.BACKEND_PORT,
    NODE_ENV: progress.env.NODE_ENV,
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
