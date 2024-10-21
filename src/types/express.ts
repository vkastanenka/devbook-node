import { User } from '@prisma/client'

// https://stackoverflow.com/questions/60155593/include-custom-typings-in-index-d-ts-npm-module saved me
// Path aliases https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
declare global {
  namespace Express {
    export interface Request {
      user?: User
      requestTime: Date
    }
  }
}
