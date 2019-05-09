import { prismaObjectType } from 'nexus-prisma'

export const DevCategory = prismaObjectType({
  name: 'DevCategory',
  definition(t) {
    t.prismaFields([
      'id',
      'devType',
      'manufacture'
    ])
  },
})