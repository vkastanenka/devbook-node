import type { Prisma, PrismaClient } from '@prisma/client'

const users: Prisma.UserCreateArgs['data'][] = [
  {
    id: 'f1bdf45e-1b1c-11ec-9621-0242ac130002',
    name: 'Victoria Kastanenka',
    email: 'vkastanenka@gmail.com',
    username: 'vkastanenka',
    image: '/images/avatar-victoria.jpg',
    headline: 'Software Engineer',
  },
]

export const seedFn = (prisma: PrismaClient) =>
  users.map(async (data: Prisma.UserCreateArgs['data']) => {
    const record = await prisma.user.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    })

    return record
  })

export const deleteFn = (prisma: PrismaClient) =>
  users.map(async (data: Prisma.UserCreateArgs['data']) => {
    await prisma.user.delete({
      where: { id: data.id },
    })
  })
