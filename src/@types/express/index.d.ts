import { User } from '@prisma/client'
import { Request } from 'express'

// https://stackoverflow.com/questions/60155593/include-custom-typings-in-index-d-ts-npm-module saved me
// Path aliases https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
export {}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User
    requestTime?: Date
  }
}
