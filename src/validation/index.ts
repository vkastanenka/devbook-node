// utils
import { AppError } from '../lib/error/app-error'
import { catchAsync } from '../lib/error/catch-async'

// types
import { HttpStatusCode } from '@vkastanenka/devbook-types/dist'
import { Request, Response, NextFunction } from 'express'

/**
 * Methods
 */

// Checks if current user id equivalent to req body user id connecting record
export const validateCurrentUserRecordCreation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.userId && req.currentUser?.id !== req.body.userId) {
    throw new AppError({
      message: 'Connection id must match current user id!',
      statusCode: HttpStatusCode.UNAUTHORIZED,
    })
  }

  next()
}

// Check if a record belongs to current user
export const validateCurrentUserRecordOwnership = ({
  idField = 'userId',
  model,
}: {
  idField?: 'id' | 'userId'
  model: any
}) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Find the record by id
    const record = await model.findUnique({
      where: {
        id: req.params.id,
      },
    })

    // If record user id does not match current user id
    if (req.currentUser?.id !== record[idField]) {
      throw new AppError({
        message: 'Record ownership not verified!',
        statusCode: HttpStatusCode.UNAUTHORIZED,
      })
    }

    // Continue
    next()
  })

// Parse req body
export const validateReqBody =
  ({ schema }: { schema: any }) =>
  (req: Request, res: Response, next: NextFunction) => {
    schema.parse(req.body)
    next()
  }
