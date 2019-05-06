import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Body from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import schema from './schemas/graphql';
import { BACKEND_PORT } from './enviroment';


const app = new Koa();
const router = new Router();

//app.use(cors());

// Inject decoded JWT content into ctx.state.currentUser
//app.use(koaJwt({ secret: JWT_SECRET, passthrough: true, key: 'currentUser' }));

router.post(
  '/graphql',
  Body(),
  graphqlKoa(async (ctx) => {
    const { currentUser } = ctx.state;
    const context = { currentUser };
    return { schema, context };
  }));

router.get('/graphql', graphqlKoa({ schema }));

// dev testing only - UI console
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());

logger.log('info', 'Backend server running on port %s', BACKEND_PORT);
app.listen(BACKEND_PORT);

