//
import { responseService } from './response-service'

// types
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

// extended prisma error handling https://stackoverflow.com/questions/75078929/how-to-handle-prisma-errors-and-send-a-valid-message-to-client
export const catchAsync = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((e) => {
      if (e instanceof ZodError) {
        const errorMessages = e.errors.map((issue: any) => ({
          [issue.path.join('.')]: issue.message,
        }))
        res
          .status(responseService.statusCodes.badRequest)
          .json(responseService.badRequestError(JSON.stringify(errorMessages)))
      } else {
        res
          .status(responseService.statusCodes.internalServerError)
          .json(responseService.internalServerError(''))
      }

      next()
    })
  }
}
