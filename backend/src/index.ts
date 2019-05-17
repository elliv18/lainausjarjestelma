import { GraphQLServer } from "graphql-yoga";
import { permissions } from "./permissions";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET, BACKEND_PORT } from "./environment";
import { typeDefs, resolvers } from "./schema";
import createRootAdmin from "./misc/rootAdmin";
import logger from "./misc/logger";

// Creating root admin if db is empty...
createRootAdmin();

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  //middlewares: [permissions],
  context: async ctx => {
    const auth = ctx.request.get("Authorization");
    let currentUser = {};
    if (auth != null) {
      try {
        currentUser = await jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
      } catch (e) {
        logger.log("warn", "[JWT] JWT token is invalid");
      }
    }
    return { currentUser };
  }
});

// Cors settings
const options = {
  port: BACKEND_PORT,
  cors: {
    creditials: true,
    origin: ["http://localhost:3000"]
  }
};

server.start(options, () =>
  logger.log("info", `🚀 Server ready at http://localhost:3050`)
);
