// import { ApolloServer, gql } from 'apollo-server';
import { GraphQLServer } from "graphql-yoga";
import { permissions } from "./permissions";
// import { prisma } from './generated/prisma-client';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./environment";
import { typeDefs, resolvers } from "./schema";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  //middlewares: [permissions],
  context: async ctx => {
    const auth = ctx.request.get("Authorization");
    let currentUser = {};
    try {
      currentUser = await jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
    } catch (e) {
      console.log("Error:", e.toString());
    }
    return { currentUser };
  }
});

// Cors settings
const options = {
  port: 3050,
  cors: {
    creditials: true,
    origin: ["http://localhost:3000"]
  }
};

server.start(options, () =>
  console.log(`🚀 Server ready at http://localhost:3050`)
);
