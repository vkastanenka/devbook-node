// types
import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

// catchAsync https://medium.com/@santoshgiri2345/simplifying-error-handling-in-express-js-with-catchasync-8a0a561ada8f
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
          message: `${issue.path.join('.')}: ${issue.message}`,
        }))
        res
          .status(400)
          .json({ error: 'Invalid data', details: errorMessages })
      } else {
        res
          .status(500)
          .json({ error: 'Internal server error' })
      }

      next()
    })
  }
}
