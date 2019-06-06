import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { IS_BROWSER, NODE_ENV } from '../lib/environment';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { BACKEND_HOST, BACKEND_PORT } = publicRuntimeConfig;

console.log(`
  NODE_ENV: ${NODE_ENV}
  BACKEND_HOST: ${BACKEND_HOST_ADDR}
  BACKEND_PORT: ${BACKEND_PORT_NRO}
`);

let apolloClient = null;

function create(initialState) {
  const JWT = IS_BROWSER && localStorage.getItem('jwtToken');
  const temp = JWT ? `Bearer ${JWT}` : null;
  console.log(JWT ? `Bearer ${JWT}` : null);
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
      //uri: 'http://localhost:3050', // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      headers: { Authorization: temp },
      // Use fetch() polyfill on the server
      fetch: !process.browser && fetch,
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
