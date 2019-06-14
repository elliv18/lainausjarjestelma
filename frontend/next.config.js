require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    BACKEND_HOST: process.env.BACKEND_HOST,
    BACKEND_PORT: process.env.BACKEND_PORT,
    PUBLIC_URL: process.env.PUBLIC_URL,
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
  },
};
