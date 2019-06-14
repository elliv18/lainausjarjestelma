import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { IS_BROWSER, NODE_ENV } from '../lib/environment';
import Cookies from 'js-cookie';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { BACKEND_HOST, BACKEND_PORT, PUBLIC_API_URL } = publicRuntimeConfig;

console.log(`
  NODE_ENV: ${NODE_ENV}
  BACKEND_HOST: ${BACKEND_HOST}
  BACKEND_PORT: ${BACKEND_PORT}
  PUBLIC_API_URL: ${PUBLIC_API_URL}
`);

let apolloClient = null;

function create(initialState) {
  let URI;
  if (NODE_ENV === 'production') {
    console.log(PUBLIC_API_URL);
    URI = PUBLIC_API_URL;
  } else {
    URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
  }
  console.log('URL: ', URL);
  const JWT = IS_BROWSER && Cookies.get('jwtToken');
  const temp = JWT ? `Bearer ${JWT}` : null;
  console.log('JWT: ', JWT ? `Bearer ${JWT}` : null);
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: URL,
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
