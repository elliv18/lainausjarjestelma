require('dotenv').config();

const { ApolloServer } = require('apollo-server');

const db = require('./tools/db');

const { DB_RESET } = require('./environment');

const resolvers = require('./schemas/graphql/resolvers');
const typeDefs = require('./schemas/graphql/typeDefs');

// Is DB ready?
db.wait();

console.log(process.env.DB_USERNAME);

// Sync db - reset?
if (DB_RESET) {
  db.reset();
} else {
  db.start();
}

// creating apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

// start server
server.listen(3050).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
