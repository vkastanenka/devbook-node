import { User } from '@prisma/client'
import { Request } from 'express'

// Path aliases https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
export {}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
    requestTime?: Date
  }
}
