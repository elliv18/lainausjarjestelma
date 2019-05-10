import { rule, shield, and, or, not } from 'graphql-shield'
import { verify } from 'jsonwebtoken' 

const rules = {
  isAuthenticatedUser: rule()((parent, args, context) => {
    //const userId = getUserId(context)
    return Boolean(true)
  }),
  isPostOwner: rule()(async (parent, { id }, context) => {
    //const userId = getUserId(context)
    //const author = await context.prisma.post({ id }).author()
    //return userId === author.id
    return true
  }),
}

export const permissions = shield({
  Query: {

  },
  Mutation: {

  },
})