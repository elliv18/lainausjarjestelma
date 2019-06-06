require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    BACKEND_HOST: process.env.BACKEND_HOST,
    BACKEND_PORT: process.env.BACKEND_PORT,
  },
};
