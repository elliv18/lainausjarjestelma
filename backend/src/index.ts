// import { ApolloServer, gql } from 'apollo-server';
import { GraphQLServer } from 'graphql-yoga'
import { permissions } from './permissions'
// import { prisma } from './generated/prisma-client';
import { typeDefs, resolvers } from './schema';

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  //middlewares: [permissions],
  context: req => {
    console.log(req)
    return {
      ...req
    }
  },
})

const options = {
  port: 3050
}

server.start(options, () => console.log(`🚀 Server ready at http://localhost:3050`))
