import { User as PrismaUser } from '@prisma/client'
import { Request } from 'express'

// Path aliases https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
export {}

interface CurrentUser extends PrismaUser {
  password?: string
}

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: CurrentUser
    errors: { [key: string]: string }
    requestTime: Date
  }
}
