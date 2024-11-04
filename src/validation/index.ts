// utils
import { AppError } from '../lib/error/app-error'
import { catchAsync } from '../lib/error/catch-async'

// types
import { HttpStatusCode } from '../types/http-status-code'
import { Request, Response, NextFunction } from 'express'

// validation
import { z } from 'zod'
import validator from 'validator'

/**
 * Inputs
 */

export const emailSchema = z.string().email()

export const phoneSchema = z.string().refine(validator.isMobilePhone)

export const urlSchema = z.string().refine(validator.isURL)

export const startYearSchema = z
  .string()
  .min(4, { message: '4 character(s) min' })
  .max(4, {
    message: '4 character(s) max',
  })
  .refine((s) => {
    const newDate = new Date()
    const newDateYear = newDate.getFullYear()
    if (Number(s) <= newDateYear) return true
  }, 'Start year cannot be greater than current year')

export const endYearSchema = z
  .string()
  .min(4, { message: '4 character(s) min' })
  .max(4, {
    message: '4 character(s) max',
  })
  .refine((s) => {
    const newDate = new Date()
    const newDateYear = newDate.getFullYear()
    if (Number(s) <= newDateYear) return true
  }, 'End year cannot be greater than current year')

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
export const validateCurrentUserRecordOwnership = ({ model }: { model: any }) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Find the record by id
    const record = await model.findUnique({
      where: {
        id: req.params.id,
      },
    })

    // If no record, respond with an error
    if (!record) {
      throw new AppError({
        message: 'Record not found!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // If record user id does not match current user id
    if (req.currentUser?.id !== record.userId) {
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
