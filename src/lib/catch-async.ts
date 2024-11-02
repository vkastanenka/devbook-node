// utils
import { Prisma } from '@prisma/client'
import { responseService } from './response-service'

// types
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const catchAsync = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      // Prisma error handling
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(err, req, res, next)
      }

      // Zod error handling
      if (err instanceof ZodError) {
        handleZodError(err, req, res, next)
      }

      res
        .status(responseService.statusCodes.internalServerError)
        .json(responseService.internalServerError())

      next(err)
    })
  }
}

const handlePrismaError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)
  switch (err.code) {
    // handling duplicate key errors
    case 'P2002':
      res.status(responseService.statusCodes.badRequest).json(
        responseService.badRequest({
          errors: { [`${err.meta.target}`]: 'Duplicate field value' },
        })
      )
      next(err)
    // handling invalid id errors
    case 'P2014':
      res.status(responseService.statusCodes.badRequest).json(
        responseService.badRequest({
          errors: { [`${err.meta.target}`]: 'Invalid ID' },
        })
      )
      next(err)
    // handling invalid data errors
    case 'P2003':
      res.status(responseService.statusCodes.badRequest).json(
        responseService.badRequest({
          errors: { [`${err.meta.target}`]: 'Invalid input data' },
        })
      )
      next(err)
    // handling all other errors
    default:
      res.status(responseService.statusCodes.internalServerError).json(
        responseService.internalServerError({
          message: `Something went wrong with ${err.meta.modelName}: ${err.meta.cause}`,
        })
      )
      next(err)
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

  res
    .status(responseService.statusCodes.badRequest)
    .json(responseService.badRequest({ errors }))

  next(err)
}
