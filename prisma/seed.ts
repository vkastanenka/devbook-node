// import prisma from '../src/lib/db'

// import { seedFn as postSeedFn, deleteFn as postDeleteFn } from './seeds/posts'
// import {
//   seedFn as sessionSeedFn,
//   deleteFn as sessionDeleteFn,
// } from './seeds/sessions'
// import { seedFn as userSeedFn, deleteFn as userDeleteFn } from './seeds/users'

// const deleteDatabase = async () => {
//   try {
//     // Posts
//     await Promise.all(postDeleteFn(prisma))
//     console.log('--- Deleted Posts ---')

//     // Sessions
//     await Promise.all(sessionDeleteFn(prisma))
//     console.log('--- Deleted Sessions ---')

//     // Users
//     await Promise.all(userDeleteFn(prisma))
//     console.log('--- Deleted Users ---')
//   } catch (error) {
//     console.warn('Please define your seed data.')
//     console.error(error)
//   }
// }

// const seedDatabase = async () => {
//   try {
//     // Users
//     const users = await Promise.all(userSeedFn(prisma))
//     console.log('--- Seeded Users ---', users)
    
//     // Posts
//     const posts = await Promise.all(postSeedFn(prisma))
//     console.log('--- Seeded Posts ---', posts)
//   } catch (error) {
//     console.warn('Please define your seed data.')
//     console.error(error)
//   }
// }

// const main = async () => {
//   await deleteDatabase()
//   // await seedDatabase()
// }

// main()
