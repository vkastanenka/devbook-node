import type { Prisma, PrismaClient } from '@prisma/client'

const sessions: Prisma.SessionCreateArgs['data'][] = [
  {
    id: 'd35623ee-bef6-42b2-8776-2f99f8bb4782',
    sessionToken: '8ac1ac77-7358-425e-be16-0bdde9f02e59',
    expires: new Date(),
    userId: 'f1bdf45e-1b1c-11ec-9621-0242ac130002',
  },
]

export const seedFn = (prisma: PrismaClient) =>
  sessions.map(async (data: Prisma.SessionCreateArgs['data']) => {
    const record = await prisma.session.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    })

    return record
  })

export const deleteFn = (prisma: PrismaClient) =>
  sessions.map(async (data: Prisma.SessionCreateArgs['data']) => {
    await prisma.session.delete({
      where: { id: data.id },
    })
  })
