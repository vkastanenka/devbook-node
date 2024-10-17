import type { Prisma, PrismaClient } from '@prisma/client'

const posts: Prisma.PostCreateArgs['data'][] = [
  {
    id: '8e3399e6-1d94-11ec-9621-0242ac130002',
    body: '🌐 Just launched my latest full stack web app, and I couldn’t be more thrilled! 🎉 It’s a task management tool designed to enhance team collaboration and boost productivity.',
    userId: 'f1bdf45e-1b1c-11ec-9621-0242ac130002',
  },
]

export const seedFn = (prisma: PrismaClient) =>
  posts.map(async (data: Prisma.PostCreateArgs['data']) => {
    const record = await prisma.post.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    })

    return record
  })

export const deleteFn = (prisma: PrismaClient) =>
  posts.map(async (data: Prisma.PostCreateArgs['data']) => {
    await prisma.post.delete({
      where: { id: data.id },
    })
  })
