import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './typeDefs';
import resolvers from './resolvers/index.mjs';

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
