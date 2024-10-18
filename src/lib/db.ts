// utils
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      user: {
        async create({ model, operation, args, query }) {
          args.data.password = await bcrypt.hash(
            args.data.password as string,
            12
          )
          return query(args)
        },
        async update({ model, operation, args, query }) {
          if (args.data.password) {
            args.data.password = await bcrypt.hash(
              args.data.password as string,
              12
            )
          }
          return query(args)
        },
      },
    },
  })
}

export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
