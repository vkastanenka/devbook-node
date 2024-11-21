// utils
import { AppError } from '../error/app-error'

// types
import { HttpStatusCode } from '@vkastanenka/devbook-types/dist'
import { Request, Response, NextFunction } from 'express'

// Restricts paths based on provided role
export const restrict = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // If the user's role is not included in the argument, deny access
    if (req.currentUser && !roles.includes(req.currentUser.role)) {
      throw new AppError({
        message: 'Insufficient permissions!',
        statusCode: HttpStatusCode.FORBIDDEN,
      })
    }

    next()
  }
}
