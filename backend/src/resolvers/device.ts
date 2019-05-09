import { prismaObjectType } from 'nexus-prisma'

export const Device = prismaObjectType({
  name: 'Device',
  definition(t) {
    t.prismaFields([
      'id',
      'idCode',
      'model',
      'info'
    ])
  },
})