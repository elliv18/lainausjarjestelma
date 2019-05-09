import { prismaObjectType } from 'nexus-prisma'

export const Loan = prismaObjectType({
  name: 'Loan',
  definition(t) {
    t.prismaFields([
      'id',
      'loanDate',
      'returnDate',
      'dueDate'
    ])
  },
})