import { prismaObjectType } from 'nexus-prisma'

export const User = prismaObjectType({
  name: 'User',
  definition(t) {
    t.prismaFields([
      'id',
      'isActive',
      'userType',
      'email',
      'password',
      'firstName',
      'lastName',
      'address',
      'opNro',
      'puh',
      'createdAt',
      'updatedAt'
    ])
  },
})