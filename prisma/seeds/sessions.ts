// import type { Prisma } from '@prisma/client'
// import { ExtendedPrismaClient } from '../../src/lib/db'

// const sessions: Prisma.SessionCreateArgs['data'][] = [
//   {
//     id: 'd35623ee-bef6-42b2-8776-2f99f8bb4782',
//     expires: new Date(),
//     userId: 'f1bdf45e-1b1c-11ec-9621-0242ac130002',
//   },
// ]

// export const seedFn = (prisma: ExtendedPrismaClient) =>
//   sessions.map(async (data: Prisma.SessionCreateArgs['data']) => {
//     const record = await prisma.session.upsert({
//       where: { id: data.id },
//       update: data,
//       create: data,
//     })

//     return record
//   })

// export const deleteFn = (prisma: ExtendedPrismaClient) =>
//   sessions.map(async (data: Prisma.SessionCreateArgs['data']) => {
//     await prisma.session.deleteMany({
//       where: { userId: data.userId },
//     })
//   })
