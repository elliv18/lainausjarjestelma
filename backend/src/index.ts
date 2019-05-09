// import { ApolloServer, gql } from 'apollo-server';
import { GraphQLServer } from 'graphql-yoga'
import { permissions } from './permissions'
import { prisma } from './generated/prisma-client';
import schema from './schema';

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
})

const options = {
  port: 4466
}

server.start(options, () => console.log(`🚀 Server ready at http://localhost:4466`))
