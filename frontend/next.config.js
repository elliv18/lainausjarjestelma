require('dotenv').config();

const withOffline = require('next-offline');

const nextConfig = {
  publicRuntimeConfig: {
    BACKEND_HOST: process.env.BACKEND_HOST,
    BACKEND_PORT: process.env.BACKEND_PORT,
    PUBLIC_URL: process.env.PUBLIC_URL,
    PUBLIC_API_URL: process.env.PUBLIC_API_URL,
  },
  workboxOpts: {
    swDest: '/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  generateInDevMode: true,
};
module.exports = withOffline(nextConfig);
