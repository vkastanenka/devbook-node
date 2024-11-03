// utils
import { AppError } from './app-error'
import { Prisma } from '@prisma/client'

// types
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

// constants
import { HttpStatusCode } from '../../types/http-status-code'

// Prisma error handler
const handlePrismaError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (err.code) {
    // "Unique constraint failed on the {constraint}"
    case 'P2002':
      return new AppError({
        message: `Unique constraint failed for: ${err.meta.target}`,
        statusCode: HttpStatusCode.BAD_REQUEST,
        errors: { [`${err.meta.target}`]: 'Duplicate field value' },
      })

    // "An operation failed because it depends on one or more records that were required but not found. {cause}"
    case 'P2025':
      return new AppError({
        message: 'Record(s) not found',
        statusCode: HttpStatusCode.NOT_FOUND,
        errors: { [err.meta.modelName]: err.meta.cause },
      })

    // handling all other errors
    default:
      return new AppError({
        message: `Something went wrong with model ${err.meta.modelName}: ${err.meta.cause}`,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        errors: { [err.meta.modelName]: err.meta.cause },
      })
  }
}

// Zod error handler
const handleZodError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: { [key: string | number]: string } = {}

  err.errors.forEach((issue: any) => {
    errors[issue.path.join('.')] = issue.message
  })

  return new AppError({
    message: `Input validation error`,
    statusCode: HttpStatusCode.BAD_REQUEST,
    errors,
  })
}

// Send error messages in dev env
const sendErrorDev = (err: any, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      errors: err.errors,
      message: err.message,
      status: err.status,
      statusCode: err.statusCode,
      success: err.success,
    })
  }

  // Rendered Website
  console.error('ERROR 💥', err)

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  })
}

// Send error messages in prod env
const sendErrorProd = (err: any, req: Request, res: Response) => {
  // API

  if (req.originalUrl.startsWith('/api')) {
    // Responding to operational errors: Trusted errors
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    }

    // Responding to programming or other unknown errors: Don't leak details
    console.error('ERROR 💥', err)

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }

  // Rendered Website

  // Responding to operational errors: Trusted errors
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    })
  }

  // Responding to programming or other unknown errors: Don't leak details
  console.error('ERROR 💥', err)

  // Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later...',
  })
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.status = err.status || 'error'
  err.statusCode = err.statusCode || 500

  // Prisma error handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('Prisma error!')
    err = handlePrismaError(err, req, res, next)
  }

  // Zod error handling
  if (err instanceof ZodError) {
    console.log('Zod error!')
    err = handleZodError(err, req, res, next)
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, req, res)
  }
}
