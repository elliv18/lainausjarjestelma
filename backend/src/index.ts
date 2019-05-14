import { GraphQLServer } from "graphql-yoga";
import { permissions } from "./permissions";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./environment";
import { typeDefs, resolvers } from "./schema";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [permissions],
  context: async ctx => {
    const auth = ctx.request.get("Authorization");
    let currentUser = {};
    if (auth != null)
      currentUser = await jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);

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
