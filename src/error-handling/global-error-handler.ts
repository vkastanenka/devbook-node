// utils
import { AppError } from './app-error'
import { Prisma } from '@prisma/client'

// types
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

const handlePrismaError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(err) => TODO: Try different errors and handle them based on code
  switch (err.code) {
    // handling duplicate key errors
    case 'P2002':
      return new AppError({
        message: 'Duplicate field value',
        statusCode: 400,
        errors: { [`${err.meta.target}`]: 'Duplicate field value' },
      })

    // handling invalid id errors
    case 'P2014':
      return new AppError({
        message: 'Invalid ID',
        statusCode: 400,
        errors: { [`${err.meta.target}`]: 'Invalid ID' },
      })

    // handling invalid data errors
    case 'P2003':
      return new AppError({
        message: 'Invalid input data',
        statusCode: 400,
        errors: { [`${err.meta.target}`]: 'Invalid input data' },
      })

    // handling all other errors
    default:
      return new AppError({
        message: `Something went wrong with ${err.meta.modelName}: ${err.meta.cause}`,
        statusCode: 500,
        errors: { [err.meta.modelName]: err.meta.cause },
      })
  }
}

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
    message: `Validation error`,
    statusCode: 400,
    errors,
  })
}

const sendErrorDev = (err: any, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      error: err,
      errors: err.errors,
      message: err.message,
      success: false,
      stack: err.stack,
      status: err.status,
    })
  }

  // Rendered Website
  console.error('ERROR 💥', err)

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  })
}

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

    return res.status(500).json({
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
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message

    // Prisma error handling
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaError(err, req, res, next)
    }

    // Zod error handling
    if (err instanceof ZodError) {
      error = handleZodError(err, req, res, next)
    }

    sendErrorProd(error, req, res)
  }
}
