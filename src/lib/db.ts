// utils
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

// prisma.$extends({
//   query: {
//     user: {
//       async create({ model, operation, args, query }) {
//         args.data.password = await bcrypt.hash(args.data.password, 12)
//         return query(args)
//       },
//     },
//   },
// })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
